// End-to-End Automated API Verification Suite
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}
require('dotenv').config();
const http = require('http');
const app = require('../app');
const { connectDB, disconnectDB, isInMemoryFallbackAllowed } = require('../config/db');
const { getLastTestEmail, clearTestOutbox } = require('./emailService');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');

let server;
let baseUrl;

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = body ? JSON.stringify(body) : null;
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      url,
      { method, headers },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData);
            resolve({ status: res.statusCode, data: parsed });
          } catch {
            resolve({ status: res.statusCode, data: rawData });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};

const runAllTests = async () => {
  const results = [];
  const recordResult = (name, passed, details = '') => {
    results.push({ name, passed, details });
    const symbol = passed ? '[PASS]' : '[FAIL]';
    console.log(`  ${symbol} ${name} ${details ? '(' + details + ')' : ''}`);
  };

  console.log('====================================================');
  console.log('  JobPortal - Automated API Verification Suite');
  console.log('====================================================\n');

  try {
    await connectDB();

    const { demoUsers, companiesData, generateOpportunities } = require('../seed/seedData');
    const existingUsers = await User.countDocuments();
    let recruiterUser;
    if (existingUsers === 0) {
      console.log('Seeding in-memory test database...');
      for (const u of demoUsers) {
        const created = await User.create(u);
        if (u.role === 'recruiter') recruiterUser = created;
      }
      const savedCompanies = [];
      for (const c of companiesData) {
        const comp = await Company.create({ ...c, recruiter: recruiterUser._id, isDemo: true });
        savedCompanies.push(comp);
      }
      recruiterUser.company = savedCompanies[0]._id;
      await recruiterUser.save();
      const opps = generateOpportunities(savedCompanies);
      for (const opp of opps) {
        await Job.create({ ...opp, recruiter: recruiterUser._id });
      }
      console.log('In-memory test database seeded successfully.\n');
    }

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    console.log(`Test server running on ephemeral port ${port}...\n`);

    // 1. Health Check, Production DB Guard, 503 Disconnected Guard & Strict Production CORS Whitelist
    const health = await makeRequest('GET', '/api/health');
    const prodGuardOk =
      isInMemoryFallbackAllowed({ NODE_ENV: 'production', ALLOW_IN_MEMORY_DB: 'true' }) === false &&
      isInMemoryFallbackAllowed({ NODE_ENV: 'production', ALLOW_IN_MEMORY_DB: 'false' }) === false;
    const corsGuardOk =
      app.isCorsOriginAllowed('https://job-portal-web-8a3p.onrender.com', 'production', 'https://job-portal-web-8a3p.onrender.com') === true &&
      app.isCorsOriginAllowed('https://evil-app.onrender.com', 'production', 'https://job-portal-web-8a3p.onrender.com') === false &&
      app.isCorsOriginAllowed('http://localhost:5173', 'production', 'https://job-portal-web-8a3p.onrender.com') === false;
    const { requireDatabase } = require('../middleware/dbReadyMiddleware');
    let db503Status = null;
    const fakeRes = { status: (code) => ({ json: () => { db503Status = code; } }) };
    const origReadyState = require('mongoose').connection.readyState;
    Object.defineProperty(require('mongoose').connection, 'readyState', { value: 0, configurable: true });
    requireDatabase({}, fakeRes, () => {});
    Object.defineProperty(require('mongoose').connection, 'readyState', { value: origReadyState, configurable: true });
    recordResult('Health Check, Prod DB Guard, 503 Fast-Fail & Strict CORS', health.status === 200 && health.data.status === 'online' && prodGuardOk && corsGuardOk && db503Status === 503);

    // 2. Public Statistics
    const publicStats = await makeRequest('GET', '/api/stats/public');
    recordResult('Public Platform Stats (/api/stats/public)', publicStats.status === 200 && publicStats.data.success);

    // 3. Public Company Directory
    const companiesRes = await makeRequest('GET', '/api/companies?limit=50');
    recordResult('Company Directory Listing (/api/companies)', companiesRes.status === 200 && companiesRes.data.companies.length > 0, `Found ${companiesRes.data.total} companies`);

    // 4. Jobs Discovery & Regex Safety (C++ query must not crash)
    const jobsRes = await makeRequest('GET', '/api/jobs?opportunityType=Job');
    const regexSafeRes = await makeRequest('GET', '/api/jobs?search=C%2B%2B');
    recordResult('Job Search, Filtering & Regex Safety (/api/jobs)', jobsRes.status === 200 && regexSafeRes.status === 200 && Array.isArray(jobsRes.data.jobs), `Retrieved ${jobsRes.data.jobs.length} jobs`);

    // 5. Internships Discovery
    const internshipsRes = await makeRequest('GET', '/api/jobs?opportunityType=Internship');
    recordResult('Internship Search & Discovery', internshipsRes.status === 200 && Array.isArray(internshipsRes.data.jobs), `Retrieved ${internshipsRes.data.jobs.length} internships`);

    // 6. Auth Login (Student, Recruiter, Admin)
    const studentLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'student@demo.com',
      password: 'Student@123'
    });
    const studentToken = studentLogin.data.token;
    recordResult('Student Authentication (/api/auth/login)', studentLogin.status === 200 && !!studentToken);

    const recruiterLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'recruiter@demo.com',
      password: 'Recruiter@123'
    });
    const recruiterToken = recruiterLogin.data.token;
    recordResult('Recruiter Authentication (/api/auth/login)', recruiterLogin.status === 200 && !!recruiterToken);

    const adminLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@demo.com',
      password: 'Admin@123'
    });
    const adminToken = adminLogin.data.token;
    recordResult('Admin Authentication (/api/auth/login)', adminLogin.status === 200 && !!adminToken);

    // 7. Public registration blocks admin role escalation
    const uniqueSuffix = Date.now();
    const regStudentRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Test Candidate',
      email: `candidate.${uniqueSuffix}@example.com`,
      password: 'Password@123',
      role: 'admin'
    });
    recordResult('Public Registration Enforces Safe Role (blocks admin escalation)', regStudentRes.status === 201 && regStudentRes.data.user?.role === 'student');

    // 8. RBAC Security
    const unauthorizedAdminAccess = await makeRequest('GET', '/api/admin/users', null, studentToken);
    const unauthorizedRecruiterAccess = await makeRequest('POST', '/api/jobs', { title: 'Blocked' }, studentToken);
    recordResult('RBAC Security: Student blocked from Admin & Recruiter routes', unauthorizedAdminAccess.status === 403 && unauthorizedRecruiterAccess.status === 403);

    const adminUsersAccess = await makeRequest('GET', '/api/admin/users', null, adminToken);
    recordResult('RBAC Authorization: Admin permitted to Admin routes', adminUsersAccess.status === 200 && Array.isArray(adminUsersAccess.data.users));

    // 8b. NoSQL Operator Injection & Unsafe URL Sanitization Guards
    const nosqlLoginRes = await makeRequest('POST', '/api/auth/login', {
      email: { $gt: '' },
      password: 'Password@123'
    });
    const xssUrlProfileRes = await makeRequest('PUT', '/api/auth/profile', {
      resumeUrl: 'javascript:alert(1)'
    }, studentToken);
    recordResult('Input Hardening: Blocks NoSQL Operator Injection & javascript: URLs', nosqlLoginRes.status === 400 && xssUrlProfileRes.status === 400);

    // 9. Change Password + Forgot Password + Reset Password workflow on newly registered user
    const candidateToken = regStudentRes.data.token;
    const candidateEmail = `candidate.${uniqueSuffix}@example.com`;

    const wrongChangeRes = await makeRequest('PUT', '/api/auth/change-password', {
      currentPassword: 'WrongPassword',
      newPassword: 'NewPassword@123',
      confirmPassword: 'NewPassword@123'
    }, candidateToken);

    const changePwRes = await makeRequest('PUT', '/api/auth/change-password', {
      currentPassword: 'Password@123',
      newPassword: 'NewPassword@123',
      confirmPassword: 'NewPassword@123'
    }, candidateToken);
    recordResult('Change Password Verification & Update', wrongChangeRes.status === 401 && changePwRes.status === 200);

    clearTestOutbox();
    const forgotUnknownRes = await makeRequest('POST', '/api/auth/forgot-password', {
      email: 'nonexistent.user@example.com'
    });
    const forgotRes = await makeRequest('POST', '/api/auth/forgot-password', {
      email: candidateEmail
    });
    const sentMail = getLastTestEmail();
    const resetToken = sentMail?.resetUrl ? sentMail.resetUrl.split('/reset-password/')[1] : null;
    recordResult('Forgot Password Generic Response & Reset Token Generation', forgotUnknownRes.status === 200 && forgotRes.status === 200 && !!resetToken);

    if (resetToken) {
      const verifyTokenRes = await makeRequest('GET', `/api/auth/reset-password/${resetToken}`);
      const resetRes = await makeRequest('POST', `/api/auth/reset-password/${resetToken}`, {
        password: 'FinalReset@123',
        confirmPassword: 'FinalReset@123'
      });
      const reuseResetRes = await makeRequest('POST', `/api/auth/reset-password/${resetToken}`, {
        password: 'AnotherReset@123',
        confirmPassword: 'AnotherReset@123'
      });
      const loginAfterReset = await makeRequest('POST', '/api/auth/login', {
        email: candidateEmail,
        password: 'FinalReset@123'
      });
      recordResult(
        'Reset Password Token Validation, Single-Use & Login',
        verifyTokenRes.status === 200 && resetRes.status === 200 && reuseResetRes.status === 400 && loginAfterReset.status === 200
      );
    }

    // Cleanup test user
    if (regStudentRes.data.user?.id) {
      await makeRequest('DELETE', `/api/admin/users/${regStudentRes.data.user.id}`, null, adminToken);
    }

    // 10. Student & Recruiter Dashboard Stats
    const studentStats = await makeRequest('GET', '/api/stats/student', null, studentToken);
    recordResult('Student Dashboard Stats (/api/stats/student)', studentStats.status === 200 && studentStats.data.success);

    const recruiterStats = await makeRequest('GET', '/api/stats/recruiter', null, recruiterToken);
    recordResult('Recruiter Dashboard Stats (/api/stats/recruiter)', recruiterStats.status === 200 && recruiterStats.data.success);

    // 11. Recruiter Post New Opportunity & Verify Visibility to Students
    const newOpportunity = await makeRequest('POST', '/api/jobs', {
      title: `Automated Test Software Engineer ${uniqueSuffix}`,
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Remote',
      location: 'Remote, India',
      category: 'Software Engineering',
      description: 'Role created by automated test suite to verify posting, visibility, and application workflows.',
      requiredSkills: ['Node.js', 'React.js', 'Testing'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 6,
      salaryMax: 10,
      openings: 2,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }, recruiterToken);
    const createdJobId = newOpportunity.data.job?._id;
    const publicDiscoveryCheck = await makeRequest('GET', `/api/jobs?search=${uniqueSuffix}`);
    const visibleToStudents = publicDiscoveryCheck.data.jobs?.some((j) => j._id === createdJobId);
    recordResult('Recruiter Post New Job & Student Discovery Visibility', newOpportunity.status === 201 && !!createdJobId && visibleToStudents);

    if (createdJobId) {
      // 12. Student Save & Unsave Job
      const saveRes = await makeRequest('POST', `/api/saved-jobs/${createdJobId}`, null, studentToken);
      const savedListRes = await makeRequest('GET', '/api/saved-jobs', null, studentToken);
      const isSavedPresent = savedListRes.data.savedJobs?.some((j) => j._id === createdJobId);
      const unsaveRes = await makeRequest('DELETE', `/api/saved-jobs/${createdJobId}`, null, studentToken);
      recordResult('Student Save & Unsave Job Persistence', saveRes.status === 201 && isSavedPresent && unsaveRes.status === 200);

      // 13. Student Application Submission & Duplicate Prevention
      const applyRes = await makeRequest('POST', `/api/applications/apply/${createdJobId}`, {
        coverLetter: 'Automated test application cover letter.',
        resumeUrl: 'https://example.com/test-resume.pdf'
      }, studentToken);
      const duplicateApplyRes = await makeRequest('POST', `/api/applications/apply/${createdJobId}`, {
        coverLetter: 'Duplicate attempt'
      }, studentToken);
      recordResult('Student Application & Duplicate Prevention (HTTP 409)', applyRes.status === 201 && duplicateApplyRes.status === 409);

      // 14. Recruiter View Applicants & Update Status
      const applicantsRes = await makeRequest('GET', `/api/applications/job/${createdJobId}`, null, recruiterToken);
      const appRecord = applicantsRes.data.applicants?.[0];
      let statusUpdated = false;
      if (appRecord?._id) {
        const updateStatusRes = await makeRequest('PUT', `/api/applications/${appRecord._id}/status`, {
          status: 'Shortlisted',
          recruiterNotes: 'Strong technical skills.'
        }, recruiterToken);
        statusUpdated = updateStatusRes.status === 200 && updateStatusRes.data.application.status === 'Shortlisted';
      }
      recordResult('Recruiter View Applicants & Shortlist Status Update', applicantsRes.status === 200 && statusUpdated);

      // 15. Recruiter Edit & Close Job -> Hidden from Active Public Search
      const editCloseRes = await makeRequest('PUT', `/api/jobs/${createdJobId}`, {
        title: `Updated Role ${uniqueSuffix}`,
        status: 'Closed'
      }, recruiterToken);
      const closedSearchRes = await makeRequest('GET', `/api/jobs?search=${uniqueSuffix}`);
      const hiddenWhenClosed = !closedSearchRes.data.jobs?.some((j) => j._id === createdJobId);
      recordResult('Recruiter Edit & Close Job (Hidden from Active Listings)', editCloseRes.status === 200 && hiddenWhenClosed);

      // 16. Cleanup test opportunity
      const deleteRes = await makeRequest('DELETE', `/api/jobs/${createdJobId}`, null, recruiterToken);
      recordResult('Recruiter Delete Opportunity Cleanup', deleteRes.status === 200);
    }

    const totalPassed = results.filter((r) => r.passed).length;
    const totalFailed = results.length - totalPassed;
    console.log('\n====================================================');
    console.log(`  Test Suite Completed: ${totalPassed} / ${results.length} PASSED`);
    console.log('====================================================\n');

    if (totalFailed > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Fatal test failure:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await disconnectDB();
    process.exit();
  }
};

runAllTests();
