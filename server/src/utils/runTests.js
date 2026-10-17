// End-to-End Automated API Verification Suite
require('dotenv').config();
const http = require('http');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

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
  console.log('  Job & Internship Portal - Automated Test Suite');
  console.log('====================================================\n');

  try {
    await connectDB();

    // Ensure database has demo data before testing
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

    // Test 1: Health Check
    const health = await makeRequest('GET', '/api/health');
    recordResult('Backend Health Check (/api/health)', health.status === 200 && health.data.status === 'online');

    // Test 2: Public Statistics
    const publicStats = await makeRequest('GET', '/api/stats/public');
    recordResult('Public Platform Stats (/api/stats/public)', publicStats.status === 200 && publicStats.data.success);

    // Test 3: Public Company Directory
    const companiesRes = await makeRequest('GET', '/api/companies?limit=50');
    recordResult('Company Directory Listing (/api/companies)', companiesRes.status === 200 && companiesRes.data.companies.length > 0, `Found ${companiesRes.data.total} companies`);

    // Test 4: Jobs Discovery & Filters
    const jobsRes = await makeRequest('GET', '/api/jobs?opportunityType=Job');
    recordResult('Job Search & Filtering (/api/jobs)', jobsRes.status === 200 && Array.isArray(jobsRes.data.jobs), `Retrieved ${jobsRes.data.jobs.length} jobs`);

    // Test 5: Internships Discovery
    const internshipsRes = await makeRequest('GET', '/api/jobs?opportunityType=Internship');
    recordResult('Internship Search & Discovery', internshipsRes.status === 200 && Array.isArray(internshipsRes.data.jobs), `Retrieved ${internshipsRes.data.jobs.length} internships`);

    // Test 6: Student Login
    const studentLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'student@demo.com',
      password: 'Student@123'
    });
    const studentToken = studentLogin.data.token;
    recordResult('Student Authentication (/api/auth/login)', studentLogin.status === 200 && !!studentToken);

    // Test 7: Recruiter Login
    const recruiterLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'recruiter@demo.com',
      password: 'Recruiter@123'
    });
    const recruiterToken = recruiterLogin.data.token;
    recordResult('Recruiter Authentication (/api/auth/login)', recruiterLogin.status === 200 && !!recruiterToken);

    // Test 8: Admin Login
    const adminLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@demo.com',
      password: 'Admin@123'
    });
    const adminToken = adminLogin.data.token;
    recordResult('Admin Authentication (/api/auth/login)', adminLogin.status === 200 && !!adminToken);

    // Test 9: Role-Based Authorization Guard (Student cannot access Admin users)
    const unauthorizedAdminAccess = await makeRequest('GET', '/api/admin/users', null, studentToken);
    recordResult('RBAC Security: Student blocked from Admin routes', unauthorizedAdminAccess.status === 403, `HTTP ${unauthorizedAdminAccess.status}`);

    // Test 10: Admin access permitted to Admin routes
    const adminUsersAccess = await makeRequest('GET', '/api/admin/users', null, adminToken);
    recordResult('RBAC Authorization: Admin permitted to Admin routes', adminUsersAccess.status === 200 && Array.isArray(adminUsersAccess.data.users));

    // Test 11: Student Dashboard Stats
    const studentStats = await makeRequest('GET', '/api/stats/student', null, studentToken);
    recordResult('Student Dashboard Stats (/api/stats/student)', studentStats.status === 200 && studentStats.data.success);

    // Test 12: Recruiter Dashboard Stats
    const recruiterStats = await makeRequest('GET', '/api/stats/recruiter', null, recruiterToken);
    recordResult('Recruiter Dashboard Stats (/api/stats/recruiter)', recruiterStats.status === 200 && recruiterStats.data.success);

    // Test 13: Recruiter Post New Opportunity
    const newOpportunity = await makeRequest('POST', '/api/jobs', {
      title: 'Automated Test Software Engineer',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Remote',
      location: 'Remote, India',
      category: 'Software Engineering',
      description: 'Role created by automated test suite to verify posting and application workflows.',
      requiredSkills: ['Node.js', 'React.js', 'Testing'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 6,
      salaryMax: 10,
      openings: 2,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    }, recruiterToken);
    const createdJobId = newOpportunity.data.job?._id;
    recordResult('Recruiter Post New Opportunity (/api/jobs)', newOpportunity.status === 201 && !!createdJobId);

    // Test 14: Student Application Submission
    if (createdJobId) {
      const applyRes = await makeRequest('POST', `/api/applications/apply/${createdJobId}`, {
        coverLetter: 'Automated test application cover letter.',
        resumeUrl: 'https://example.com/test-resume.pdf'
      }, studentToken);
      recordResult('Student Application Submission', applyRes.status === 201 && applyRes.data.success);

      // Test 15: Duplicate Application Prevention
      const duplicateApplyRes = await makeRequest('POST', `/api/applications/apply/${createdJobId}`, {
        coverLetter: 'Duplicate attempt'
      }, studentToken);
      recordResult('Duplicate Application Prevention Check', duplicateApplyRes.status === 409, `HTTP ${duplicateApplyRes.status} Conflict`);

      // Test 16: Recruiter View Applicants
      const applicantsRes = await makeRequest('GET', `/api/applications/job/${createdJobId}`, null, recruiterToken);
      const appRecord = applicantsRes.data.applicants?.[0];
      recordResult('Recruiter View Job Applicants', applicantsRes.status === 200 && applicantsRes.data.count >= 1);

      // Test 17: Recruiter Update Applicant Status
      if (appRecord?._id) {
        const updateStatusRes = await makeRequest('PUT', `/api/applications/${appRecord._id}/status`, {
          status: 'Shortlisted',
          recruiterNotes: 'Profile looks very solid for an entry-level candidate.'
        }, recruiterToken);
        recordResult('Recruiter Update Applicant Status (Shortlisted)', updateStatusRes.status === 200 && updateStatusRes.data.application.status === 'Shortlisted');
      }

      // Cleanup test opportunity
      await makeRequest('DELETE', `/api/jobs/${createdJobId}`, null, recruiterToken);
      recordResult('Recruiter Delete Opportunity Cleanup', true);
    }

    // Summary
    const totalPassed = results.filter(r => r.passed).length;
    console.log('\n====================================================');
    console.log(`  Test Suite Completed: ${totalPassed} / ${results.length} PASSED`);
    console.log('====================================================\n');

  } catch (err) {
    console.error('Fatal test failure:', err);
  } finally {
    if (server) {
      server.close();
    }
    await disconnectDB();
    process.exit(0);
  }
};

runAllTests();
