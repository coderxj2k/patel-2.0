// A collection of high-quality appliance placeholders for Patel Electronics
export const getApplianceImage = (category, seed = '') => {
  const cat = (category || '').toLowerCase();
  
  const fridges = [
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop'
  ];
  
  const washers = [
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558029006-66b89710c3cd?w=800&h=600&fit=crop'
  ];
  
  const tvs = [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop'
  ];
  
  const acs = [
    'https://images.unsplash.com/photo-1610552050890-fe99536c2615?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574383404275-24236b5f264a?w=800&h=600&fit=crop'
  ];

  const generic = [
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop'
  ];

  let selectedArray = generic;
  
  if (cat.includes('fridge') || cat.includes('cold')) selectedArray = fridges;
  else if (cat.includes('wash') || cat.includes('fabric')) selectedArray = washers;
  else if (cat.includes('tv') || cat.includes('visual') || cat.includes('entertainment') || cat.includes('screen')) selectedArray = tvs;
  else if (cat.includes('ac') || cat.includes('climate') || cat.includes('air') || cat.includes('cool')) selectedArray = acs;

  const index = seed ? seed.length % selectedArray.length : 0;
  return selectedArray[index];
};
