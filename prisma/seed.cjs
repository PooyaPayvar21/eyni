const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  // Create cities
  const tehran = await prisma.city.upsert({
    where: { name: 'Tehran' },
    update: {},
    create: { 
      name: 'Tehran',
      isActive: true,
    },
  });

  const shiraz = await prisma.city.upsert({
    where: { name: 'Shiraz' },
    update: {},
    create: { 
      name: 'Shiraz',
      isActive: true,
    },
  });
  const shoush = await prisma.city.upsert({
    where: {name : 'Shoush'},
    update:{},
    create:{
        name:'Shoush',
        isActive: true
    },
  });

  // Create clinics
  // First find existing clinics
  const existingMehrClinic = await prisma.clinic.findFirst({
    where: { name: 'Mehr Clinic' }
  });

  const existingDrEyniClinic = await prisma.clinic.findFirst({
    where: { name: 'Dr.Eyni' }
  });

  const existingShafaClinic = await prisma.clinic.findFirst({
    where: { name: 'Shafa Clinic' }
  });

  // Then create or use existing clinics
  const mehrclinic = existingMehrClinic || await prisma.clinic.create({
    data: {
      name: 'Mehr Clinic',
      address: 'Valiasr St, Tehran',
      cityId: tehran.id,
    },
  });

  const dreyni = existingDrEyniClinic || await prisma.clinic.create({
    data: {
      name: 'Dr.Eyni',
      address: 'Da\'bel st.',
      cityId: shoush.id
    },
  });

  const shafaclinic = existingShafaClinic || await prisma.clinic.create({
    data: {
      name: 'Shafa Clinic',
      address: 'Zand St, Shiraz',
      cityId: shiraz.id,
    },
  });

  // Create doctors with their user accounts
  const drAliUser = await prisma.user.upsert({
    where: { email: 'dr.ali@example.com' },
    update: {},
    create: {
      email: 'dr.ali@example.com',
      name: 'Dr. Ali Hosseini',
      password: await bcrypt.hash('doctor123', 10),
      role: 'DOCTOR',
    },
  });
  
  const drEyniUser = await prisma.user.upsert({
    where: { email: 'dr.eyni@example.com' },
    update: {},
    create: {
      email: 'dr.eyni@example.com',
      name: "Dr. Eyni",
      password: await bcrypt.hash('eyni123',10),
      role: 'DOCTOR'
    }
  });

  const drSaraUser = await prisma.user.upsert({
    where: { email: 'dr.sara@example.com' },
    update: {},
    create: {
      email: 'dr.sara@example.com',
      name: 'Dr. Sara Mohammadi',
      password: await bcrypt.hash('doctor123', 10),
      role: 'DOCTOR',
    },
  });

  // Create doctors
  const drAli = await prisma.doctor.upsert({
    where: { slug: 'dr-ali-hosseini-pediatrics' },
    update: {},
    create: {
      name: 'Dr. Ali Hosseini',
      specialty: 'Pediatrics',
      bio: 'Specialized in pediatric care with over 15 years of experience',
      slug: 'dr-ali-hosseini-pediatrics',
      clinicId: mehrclinic.id,
      userId: drAliUser.id,
    },
  });
  
  const drreyni = await prisma.doctor.upsert({
    where: { slug: 'dr-eyni-ophthalmologist' },
    update: {},
    create: {
      name: 'Dr. Eyni',
      specialty: 'Ophthalmologist',
      bio: 'این یک بیوگرافی تست میباشد',
      slug: 'dr-eyni-ophthalmologist',
      clinicId: dreyni.id,
      userId: drEyniUser.id,
    },
  });

  const drSara = await prisma.doctor.upsert({
    where: { slug: 'dr-sara-mohammadi-dermatology' },
    update: {},
    create: {
      name: 'Dr. Sara Mohammadi',
      specialty: 'Dermatology',
      bio: 'Expert in clinical and cosmetic dermatology',
      slug: 'dr-sara-mohammadi-dermatology',
      clinicId: shafaclinic.id,
      userId: drSaraUser.id,
    },
  });

  // Create secretaries with their user accounts
  const secretary1User = await prisma.user.upsert({
    where: { email: 'mina.sec@example.com' },
    update: {},
    create: {
      email: 'mina.sec@example.com',
      name: 'Mina Ahmadi',
      password: await bcrypt.hash('secretary123', 10),
      role: 'SECRETARY',
    },
  });

  const secretary2User = await prisma.user.upsert({
    where: { email: 'zahra.sec@example.com' },
    update: {},
    create: {
      email: 'zahra.sec@example.com',
      name: 'Zahra Karimi',
      password: await bcrypt.hash('secretary123', 10),
      role: 'SECRETARY',
    },
  });

  const secretary3User = await prisma.user.upsert({
    where: { email: 'sara.sec@example.com' },
    update: {},
    create: {
      email: 'sara.sec@example.com',
      name: 'Sara Nazari',
      password: await bcrypt.hash('secretary123', 10),
      role: 'SECRETARY',
    },
  });

  // Link secretaries to doctors
  await prisma.secretary.upsert({
    where: { userId: secretary1User.id },
    update: {},
    create: {
      name: 'Mina Ahmadi',
      userId: secretary1User.id,
      doctorId: drAli.id,
    },
  });

  await prisma.secretary.upsert({
    where: { userId: secretary2User.id },
    update: {},
    create: {
      name: 'Zahra Karimi',
      userId: secretary2User.id,
      doctorId: drSara.id,
    },
  });

  await prisma.secretary.upsert({
    where: { userId: secretary3User.id },
    update: {},
    create: {
      name: 'Sara Nazari',
      userId: secretary3User.id,
      doctorId: drreyni.id,
    },
  });

  // Create availability slots for next 7 days
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  // Helper function to create slots with upsert
  async function createSlot(doctorId, datetime) {
    await prisma.availabilitySlot.upsert({
      where: {
        doctorId_datetime: {
          doctorId,
          datetime
        }
      },
      update: {},
      create: {
        doctorId,
        datetime,
        isBooked: false,
      },
    });
  }

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    // Create slots for Dr. Ali (9 AM to 2 PM)
    for (let hour = 9; hour < 14; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      await createSlot(drAli.id, slotTime);
    }

    // Create slots for Dr. Sara (2 PM to 8 PM)
    for (let hour = 14; hour < 20; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      await createSlot(drSara.id, slotTime);
    }

    // Create slots for Dr. Eyni (10 AM to 4 PM)
    for (let hour = 10; hour < 16; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      await createSlot(drreyni.id, slotTime);
    }
  }

  // Create some sample appointments
  await prisma.appointment.create({
    data: {
      datetime: new Date(startDate.setHours(10, 0, 0, 0)),
      patientName: 'Reza Maleki',
      patientPhone: '09123456789',
      status: 'CONFIRMED',
      doctorId: drAli.id,
    },
  });

  await prisma.appointment.create({
    data: {
      datetime: new Date(startDate.setHours(15, 0, 0, 0)),
      patientName: 'Maryam Hashemi',
      patientPhone: '09187654321',
      status: 'PENDING',
      doctorId: drSara.id,
    },
  });

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
