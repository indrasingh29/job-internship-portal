require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');

const { demoUsers, companiesData, generateOpportunities } = require('./seedData');

const seedDataCore = async () => {
  console.log('====================================================');
  console.log('  Job & Internship Portal - Database Seeding');
  console.log('  B.Tech CSE Minor Project by Indra Singh Jeena');
  console.log('====================================================');

  // 1. Seed Demo Users (Student, Recruiter, Admin)
  console.log('\n[1/5] Seeding Demo User Accounts...');
  const userMap = {};

  for (const u of demoUsers) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      existing = await User.create(u);
      console.log(`  + Created user: ${u.email} [${u.role}]`);
    } else {
      console.log(`  * User already exists: ${u.email} [${u.role}]`);
    }
    userMap[u.role] = existing;
  }

  const recruiterUser = userMap['recruiter'];
  const studentUser = userMap['student'];

  // 2. Seed 50 Company Profiles
  console.log('\n[2/5] Seeding 50 Curated Company Profiles...');
  const savedCompanies = [];

  for (const comp of companiesData) {
    let existingComp = await Company.findOne({ name: comp.name });
    if (!existingComp) {
      existingComp = await Company.create({
        ...comp,
        recruiter: recruiterUser._id,
        isDemo: true
      });
      console.log(`  + Seeded company: ${comp.name} (${comp.industry})`);
    }
    savedCompanies.push(existingComp);
  }
  console.log(`  => Total companies in database: ${savedCompanies.length}`);

  // Link demo recruiter's company to Flipkart or TCS
  if (!recruiterUser.company && savedCompanies.length > 0) {
    recruiterUser.company = savedCompanies[0]._id;
    await recruiterUser.save();
  }

  // 3. Seed 52 Sample Opportunities (Jobs & Internships)
  console.log('\n[3/5] Seeding 52 Sample Opportunities...');
  const opportunities = generateOpportunities(savedCompanies);
  let seededJobsCount = 0;

  for (const opp of opportunities) {
    const existingJob = await Job.findOne({
      title: opp.title,
      company: opp.company
    });

    if (!existingJob) {
      await Job.create({
        ...opp,
        recruiter: recruiterUser._id
      });
      seededJobsCount++;
    }
  }
  const totalJobs = await Job.countDocuments();
  console.log(`  => Added ${seededJobsCount} new listings. Total opportunities: ${totalJobs}`);

  // 4. Seed sample applications for student demonstration
  console.log('\n[4/5] Seeding initial student application and bookmark for dashboard preview...');
  const sampleJob = await Job.findOne({ title: 'MERN Stack Developer' });
  const sampleInternship = await Job.findOne({ title: 'Software Engineering Intern' });

  if (sampleJob && studentUser) {
    const appExists = await Application.findOne({ job: sampleJob._id, student: studentUser._id });
    if (!appExists) {
      await Application.create({
        job: sampleJob._id,
        student: studentUser._id,
        coverLetter: 'I am excited to apply for this MERN Stack Developer role. I have built several full-stack projects using React, Node.js, Express, and MongoDB.',
        resumeUrl: studentUser.profile?.resumeUrl,
        status: 'Applied'
      });
      console.log('  + Seeded initial demo application for Student.');
    }
  }

  // 5. Seed sample saved bookmark
  if (sampleInternship && studentUser) {
    const savedExists = await SavedJob.findOne({ job: sampleInternship._id, student: studentUser._id });
    if (!savedExists) {
      await SavedJob.create({
        job: sampleInternship._id,
        student: studentUser._id
      });
      console.log('  + Seeded initial saved opportunity for Student.');
    }
  }

  console.log('\n====================================================');
  console.log('  Database Seeding Completed Successfully!');
  console.log('  Demo Student:   student@demo.com  / Student@123');
  console.log('  Demo Recruiter: recruiter@demo.com / Recruiter@123');
  console.log('  Demo Admin:     admin@demo.com    / Admin@123');
  console.log('====================================================\n');

  return { users: userMap, companies: savedCompanies, totalJobs };
};

const seedDatabase = async () => {
  try {
    await connectDB();
    await seedDataCore();
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    console.error(error.stack);
    await disconnectDB();
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDataCore, seedDatabase };
