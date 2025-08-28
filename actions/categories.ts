'use server';

import { prisma } from '@/lib/prisma';

export const createDefaultCategories = async () => {
  try {
    const count = await prisma.category.count();
    if (count > 0) return;

    const categories = [
      {
        name: 'Income',
        subcategories: {
          create: [
            { name: 'Salary & Wages' },
            { name: 'Bonuses & Commissions' },
            { name: 'Business Income' },
            { name: 'Investments & Dividends' },
            { name: 'Rental Income' },
            { name: 'Gifts Received' },
            { name: 'Refunds/Reimbursements' },
            { name: 'Other Income' },
          ],
        },
      },
      {
        name: 'Housing & Utilities',
        subcategories: {
          create: [
            { name: 'Rent' },
            { name: 'Mortgage' },
            { name: 'Property Taxes' },
            { name: 'Home Insurance' },
            { name: 'Electricity' },
            { name: 'Water & Sewer' },
            { name: 'Gas' },
            { name: 'Internet' },
            { name: 'Mobile Phone' },
            { name: 'Home Maintenance & Repairs' },
            { name: 'Strata / Body Corporate Fees' },
            { name: 'Security Systems' },
          ],
        },
      },
      {
        name: 'Transportation',
        subcategories: {
          create: [
            { name: 'Fuel / Petrol' },
            { name: 'Public Transport' },
            { name: 'Rideshare' },
            { name: 'Taxis' },
            { name: 'Vehicle Loan Payments' },
            { name: 'Vehicle Insurance' },
            { name: 'Vehicle Registration' },
            { name: 'Vehicle Maintenance & Repairs' },
            { name: 'Parking Fees' },
            { name: 'Tolls' },
            { name: 'Bicycle Maintenance' },
            { name: 'Air Travel' },
          ],
        },
      },
      {
        name: 'Food & Dining',
        subcategories: {
          create: [
            { name: 'Groceries' },
            { name: 'Dining Out' },
            { name: 'Cafés & Coffee Shops' },
            { name: 'Fast Food' },
            { name: 'Bars & Pubs' },
            { name: 'Takeaway Delivery' },
          ],
        },
      },
      {
        name: 'Shopping',
        subcategories: {
          create: [
            { name: 'Clothing' },
            { name: 'Shoes' },
            { name: 'Accessories & Jewelry' },
            { name: 'Electronics' },
            { name: 'Appliances' },
            { name: 'Furniture' },
            { name: 'Home Décor' },
            { name: 'Health & Beauty Products' },
            { name: 'Toys & Games' },
            { name: 'Gifts & Flowers' },
            { name: 'Online Marketplaces' },
          ],
        },
      },
      {
        name: 'Entertainment & Leisure',
        subcategories: {
          create: [
            { name: 'Streaming Services' },
            { name: 'Movies & Theatre' },
            { name: 'Concerts & Events' },
            { name: 'Books & Magazines' },
            { name: 'Video Games & Apps' },
            { name: 'Sports & Fitness Activities' },
            { name: 'Hobbies & Crafts' },
            { name: 'Gambling & Lottery' },
          ],
        },
      },
      {
        name: 'Health & Wellness',
        subcategories: {
          create: [
            { name: 'Health Insurance' },
            { name: 'Doctor & Specialist Visits' },
            { name: 'Dental Care' },
            { name: 'Optical / Eyewear' },
            { name: 'Physiotherapy / Chiropractic' },
            { name: 'Gym Memberships' },
            { name: 'Personal Training' },
            { name: 'Sports Club Memberships' },
            { name: 'Mental Health / Counselling' },
            { name: 'Medications & Pharmacy' },
            { name: 'Alternative Medicine' },
          ],
        },
      },
      {
        name: 'Education',
        subcategories: {
          create: [
            { name: 'School Fees' },
            { name: 'University / College Fees' },
            { name: 'Textbooks & Study Materials' },
            { name: 'Courses & Certifications' },
            { name: 'Tutoring' },
            { name: 'School Supplies' },
          ],
        },
      },
      {
        name: 'Family & Childcare',
        subcategories: {
          create: [
            { name: 'Childcare / Daycare' },
            { name: 'School Activities & Excursions' },
            { name: 'Babysitting' },
            { name: "Children's Clothing" },
            { name: "Children's Toys & Games" },
            { name: 'Child Support Payments' },
            { name: 'Elderly Care' },
          ],
        },
      },
      {
        name: 'Pets',
        subcategories: {
          create: [
            { name: 'Pet Food' },
            { name: 'Pet Supplies' },
            { name: 'Veterinary Services' },
            { name: 'Pet Insurance' },
            { name: 'Pet Grooming' },
            { name: 'Pet Boarding / Daycare' },
          ],
        },
      },
      {
        name: 'Bills & Subscriptions',
        subcategories: {
          create: [
            { name: 'Memberships & Subscriptions' },
            { name: 'Software & Apps' },
            { name: 'Cloud Storage' },
            { name: 'Professional Memberships' },
            { name: 'Newspaper / Magazine Subscriptions' },
          ],
        },
      },
      {
        name: 'Financial',
        subcategories: {
          create: [
            { name: 'Bank Fees' },
            { name: 'ATM Fees' },
            { name: 'Loan Payments' },
            { name: 'Credit Card Payments' },
            { name: 'Interest Charges' },
            { name: 'Investments' },
            { name: 'Superannuation Contributions' },
            { name: 'Taxes Paid' },
          ],
        },
      },
      {
        name: 'Travel',
        subcategories: {
          create: [
            { name: 'Accommodation' },
            { name: 'Flights' },
            { name: 'Car Hire' },
            { name: 'Travel Insurance' },
            { name: 'Tours & Activities' },
            { name: 'Travel Meals & Drinks' },
            { name: 'Souvenirs' },
          ],
        },
      },
      {
        name: 'Giving & Donations',
        subcategories: {
          create: [
            { name: 'Charity Donations' },
            { name: 'Religious Contributions' },
            { name: 'Fundraising' },
          ],
        },
      },
      {
        name: 'Personal Care',
        subcategories: {
          create: [
            { name: 'Haircuts & Barber' },
            { name: 'Beauty Treatments' },
            { name: 'Spa & Massage' },
            { name: 'Cosmetics & Skincare' },
          ],
        },
      },
      {
        name: 'Miscellaneous',
        subcategories: {
          create: [
            { name: 'Uncategorized' },
            { name: 'Cash Withdrawals' },
            { name: 'Lost / Stolen Money' },
            { name: 'Rounding Adjustments' },
          ],
        },
      },
    ];

    for (const categoryData of categories) {
      await prisma.category.create({
        data: categoryData,
        include: {
          subcategories: true,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};
