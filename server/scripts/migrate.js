import { PrismaClient } from '@prisma/client';
import { AVAILABLE_DISTRICTS, VENUES } from '../../src/data/mockData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration...');

  // 1. Clear existing data
  await prisma.menuPosition.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.district.deleteMany();

  // 2. Migrate Districts
  for (const district of AVAILABLE_DISTRICTS) {
    await prisma.district.create({
      data: {
        id: district.id,
        name: district.name,
        center: district.center,
        color: district.color,
        bounds: district.bounds,
        polygon: district.polygon,
      }
    });
  }
  console.log('Districts migrated.');

  // 3. Migrate Venues and Items
  for (const venue of VENUES) {
    const createdVenue = await prisma.venue.create({
      data: {
        id: venue.id,
        name: venue.name,
        type: venue.type,
        tags: venue.tags || [],
        address: venue.address,
        distance: venue.distance,
        rating: venue.rating,
        image: venue.image,
        closingTime: venue.closingTime,
        pickupWindow: venue.pickupWindow,
        coords: venue.coords,
        districtId: venue.district_id || 'petrogradsky', // fallback for mock data matches
      }
    });

    if (venue.categories) {
      for (const item of venue.categories) {
        await prisma.menuPosition.create({
          data: {
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            oldPrice: item.oldPrice,
            slots: item.slots,
            description: item.description,
            venueId: createdVenue.id,
          }
        });
      }
    }
  }
  console.log('Venues and menu positions migrated.');
  console.log('Migration complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
