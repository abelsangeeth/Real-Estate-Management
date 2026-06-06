import * as bcrypt from 'bcrypt';
import { User, Listing, Inquiry } from '@prisma/client';

export let mockUsers: User[] = [];
export let mockListings: Listing[] = [];
export const mockInquiries: (Inquiry & {
  listing: { title: string; price: number; location: string };
})[] = [];

let isInitialized = false;

export async function initMockDb() {
  if (isInitialized) return;

  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const agentPassword = await bcrypt.hash('agent123', saltRounds);
  const buyerPassword = await bcrypt.hash('buyer123', saltRounds);

  mockUsers = [
    {
      id: 'usr-admin',
      email: 'admin@aura.com',
      password: adminPassword,
      name: 'Aura Admin',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'usr-agent',
      email: 'agent@aura.com',
      password: agentPassword,
      name: 'Seraphina Vance',
      role: 'agent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'usr-buyer',
      email: 'buyer@aura.com',
      password: buyerPassword,
      name: 'Julian Sterling',
      role: 'buyer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  mockListings = [
    {
      id: 'lst-1',
      title: "Villa L'Horizon",
      description:
        "Perched majestically on the cliffs of Éze, France, Villa L'Horizon is a masterclass in modern architecture. Offering unobstructed 270-degree Mediterranean views, this architectural marvel spans three tiers of glass and white travertine. Experience ultimate luxury with a clifftop glass infinity pool, a private helipad, a wellness pavilion, and custom-curated Italian interiors.",
      price: 24500000.0,
      location: "Éze, Côte d'Azur, France",
      bedrooms: 6,
      bathrooms: 7.5,
      areaSqFt: 12000,
      imageUrl: '/assets/villa_horizon.jpg',
      isFeatured: true,
      amenities:
        'Infinity Pool, Private Helipad, Wine Cellar, Wellness Spa, Panoramic Sea Views, Travertine Terraces',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'lst-2',
      title: 'The Eclipse Duplex Penthouse',
      description:
        "Suspended above Manhattan, The Eclipse Duplex Penthouse redefines urban luxury. Located on the 82nd floor of Billionaires' Row, this residence offers sweeping views of Central Park and the city skyline. Features include double-height ceilings, a private rooftop plunge pool, a personal library, a private elevator, and bespoke marble details.",
      price: 38000000.0,
      location: 'Manhattan, New York City, USA',
      bedrooms: 4,
      bathrooms: 4.5,
      areaSqFt: 7500,
      imageUrl: '/assets/penthouse_eclipse.jpg',
      isFeatured: true,
      amenities:
        'Private Elevator, Duplex Plunge Pool, Panoramic Central Park Views, Concierge Service, Bespoke Wine Wall',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'lst-3',
      title: 'The Aura Sanctuary',
      description:
        "Enclosed in a gated enclave in Beverly Hills, The Aura Sanctuary is a seamless integration of organic design and extreme luxury. With floor-to-ceiling glass retracting at the push of a button, the living spaces flow into an expansive garden featuring a limestone fire pit and waterfalls. An entertainer's dream, it includes a professional chef kitchen, private theater, and a 10-car auto gallery.",
      price: 42000000.0,
      location: 'Beverly Hills, California, USA',
      bedrooms: 7,
      bathrooms: 9.0,
      areaSqFt: 15500,
      imageUrl: '/assets/aura_heights.jpg',
      isFeatured: true,
      amenities:
        '10-Car Auto Gallery, Home Cinema, Professional Chef Kitchen, Waterfall Pools, Smart Home Automation, Private Gym',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'lst-4',
      title: 'Oceana Yacht Cove',
      description:
        'Positioned on a prime waterfront lot in Miami Beach, Oceana Yacht Cove is designed for the modern mariner. This estate includes 150 feet of deep-water dockage, capable of hosting superyachts. Featuring a contemporary tropical design, an expansive wrap-around pool deck, and glass walls overlooking Biscayne Bay, this is coastal luxury at its zenith.',
      price: 18900000.0,
      location: 'Miami Beach, Florida, USA',
      bedrooms: 5,
      bathrooms: 6.0,
      areaSqFt: 9200,
      imageUrl: '/assets/oceana_cove.jpg',
      isFeatured: false,
      amenities:
        'Superyacht Dock, Heated Saltwater Pool, Outdoor Living Kitchen, Floor-to-ceiling Glass, Rooftop Solarium',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  isInitialized = true;
}
