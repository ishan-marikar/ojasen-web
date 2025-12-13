import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding events and sessions...');

  // Create Yin Yoga event
  const yinYoga = await prisma.event.create({
    data: {
      id: 'event_yin_yoga',
      title: 'Yin Yoga',
      description: 'Slow, still poses that melt tension and quiet the mind.',
      fullDescription: 'A grounding Yin Yoga session focused on long-held, gentle poses designed to release deep tension in the body and calm the nervous system. Ideal for restoring balance and cultivating inner quiet.',
      category: 'Yoga',
      image: '/images/placeholder.png',
      defaultPrice: 3000,
      defaultLocation: 'Ojasen Healing Arts',
      status: 'active',
    },
  });

  // Create sessions for Yin Yoga
  await prisma.eventSession.create({
    data: {
      id: 'session_yin_yoga_dec_8',
      eventId: yinYoga.id,
      date: new Date('2025-12-08'),
      time: '6:00 PM',
      location: 'Ojasen Healing Arts',
      price: 3000,
      capacity: 20,
      status: 'active',
    },
  });

  await prisma.eventSession.create({
    data: {
      id: 'session_yin_yoga_dec_15',
      eventId: yinYoga.id,
      date: new Date('2025-12-15'),
      time: '6:00 PM',
      location: 'Ojasen Healing Arts',
      price: 3000,
      capacity: 20,
      status: 'active',
    },
  });

  // Create Reiki Healing event
  const reikiHealing = await prisma.event.create({
    data: {
      id: 'event_reiki_healing',
      title: 'Reiki Healing 1:1',
      description: 'Restores balance and clears emotional heaviness.',
      fullDescription: 'A one-on-one Reiki healing session designed to cleanse energetic blockages, lighten emotional weight, and help you return to a state of inner equilibrium. Gentle, non-invasive, and deeply restorative.',
      category: 'Healing',
      image: '/images/placeholder.png',
      defaultPrice: 6000,
      defaultLocation: 'Ojasen Healing Arts',
      status: 'active',
    },
  });

  // Create session for Reiki (by appointment)
  await prisma.eventSession.create({
    data: {
      id: 'session_reiki_dec_10',
      eventId: reikiHealing.id,
      date: new Date('2025-12-10'),
      time: 'By Appointment',
      location: 'Ojasen Healing Arts',
      price: 6000,
      capacity: 5,
      status: 'active',
    },
  });

  // Create Samatva Flow event
  const samatvaFlow = await prisma.event.create({
    data: {
      id: 'event_samatva_flow',
      title: 'Samatva Flow',
      description: 'A gentle, balanced flow to reset your energy and find centered stillness.',
      fullDescription: 'A mindful movement practice inspired by the Sanskrit word "Samatva" — equanimity. This session blends breath and flow to help you return to balance, steadiness, and quiet inner presence.',
      category: 'Yoga',
      image: '/images/placeholder.png',
      defaultPrice: 3500,
      defaultLocation: 'Ojasen Healing Arts',
      status: 'active',
    },
  });

  await prisma.eventSession.create({
    data: {
      id: 'session_samatva_dec_12',
      eventId: samatvaFlow.id,
      date: new Date('2025-12-12'),
      time: '6:00 PM',
      location: 'Ojasen Healing Arts',
      price: 3500,
      capacity: 20,
      status: 'active',
    },
  });

  // Create Anahata Flow event
  const anahataFlow = await prisma.event.create({
    data: {
      id: 'event_anahata_flow',
      title: 'Anahata Flow',
      description: 'A soothing sound healing session designed to awaken and expand the heart.',
      fullDescription: 'A heart-centered healing experience combining gentle movement, breath, and therapeutic sound frequencies. Designed to release emotional tightness, open the heart space, and invite softness and connection.',
      category: 'Sound Healing',
      image: '/images/placeholder.png',
      defaultPrice: 4000,
      defaultLocation: 'Ojasen Healing Arts',
      status: 'active',
    },
  });

  await prisma.eventSession.create({
    data: {
      id: 'session_anahata_dec_13',
      eventId: anahataFlow.id,
      date: new Date('2025-12-13'),
      time: '6:00 PM',
      location: 'Ojasen Healing Arts',
      price: 4000,
      capacity: 20,
      status: 'active',
    },
  });

  console.log('✅ Successfully seeded 4 events and 6 sessions!');
  
  // Display summary
  const eventCount = await prisma.event.count();
  const sessionCount = await prisma.eventSession.count();
  
  console.log(`\n📊 Database Summary:`);
  console.log(`   Events: ${eventCount}`);
  console.log(`   Sessions: ${sessionCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
