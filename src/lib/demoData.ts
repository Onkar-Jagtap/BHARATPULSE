import { VoterRecord } from './dataProcessor';

const PARTIES = ['BJP', 'INC', 'AAP', 'DMK', 'TMC', 'BSP', 'Undecided'];
const ISSUES = ['Employment', 'Inflation', 'Healthcare', 'Agriculture', 'Education', 'Infrastructure', 'Safety'];
const OCCUPATIONS = ['Student', 'Farmer', 'Service', 'Business', 'Retired', 'Homemaker'];
const EDUCATION = ['Upto 10th', 'Intermediate', 'Graduate', 'Post-Graduate', 'Professional'];
const INCOME = ['< 5L', '5-10L', '10-20L', '> 20L'];

const STATE_CONFIGS = [
  { 
    name: 'Maharashtra', 
    constituencies: ['Pune City', 'Mumbai Central', 'Thane', 'Nagpur South', 'Nashik West'],
    weights: { BJP: 0.35, INC: 0.25, Undecided: 0.2, Others: 0.2 }
  },
  { 
    name: 'Uttar Pradesh', 
    constituencies: ['Lucknow East', 'Kanpur Nagar', 'Varanasi Cantt', 'Gorakhpur Urban', 'Agra South'],
    weights: { BJP: 0.45, INC: 0.15, Undecided: 0.25, Others: 0.15 }
  },
  { 
    name: 'Karnataka', 
    constituencies: ['Bengaluru South', 'Mysuru City', 'Hubballi-Dharwad Central', 'Mangaluru City South'],
    weights: { BJP: 0.38, INC: 0.4, Undecided: 0.15, Others: 0.07 }
  },
  {
    name: 'Delhi',
    constituencies: ['New Delhi', 'Chandni Chowk', 'South Delhi', 'East Delhi'],
    weights: { AAP: 0.45, BJP: 0.35, INC: 0.15, Undecided: 0.05 }
  }
];

export function generateDemoData(count: number = 1000): VoterRecord[] {
  const data: VoterRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    const stateConfig = STATE_CONFIGS[Math.floor(Math.random() * STATE_CONFIGS.length)];
    const partyRoll = Math.random();
    let preferredParty = 'Undecided';
    
    // Simple weight-based party assignment
    let currentWeight = 0;
    for (const [party, weight] of Object.entries(stateConfig.weights)) {
      currentWeight += weight;
      if (partyRoll <= currentWeight) {
        preferredParty = party === 'Others' ? PARTIES[Math.floor(Math.random() * (PARTIES.length - 2))] : party;
        break;
      }
    }

    const satisfactionScore = Math.floor(Math.random() * 10) + 1;
    const sentiment: 'Positive' | 'Negative' | 'Neutral' = 
      satisfactionScore > 7 ? 'Positive' : satisfactionScore < 4 ? 'Negative' : 'Neutral';

    data.push({
      id: Math.random().toString(36).substr(2, 9),
      state: stateConfig.name,
      district: stateConfig.name + ' Dist',
      constituency: stateConfig.constituencies[Math.floor(Math.random() * stateConfig.constituencies.length)],
      age: Math.floor(Math.random() * 50) + 18,
      gender: Math.random() > 0.5 ? 'Male' : (Math.random() > 0.1 ? 'Female' : 'Other'),
      occupation: OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)],
      incomeGroup: INCOME[Math.floor(Math.random() * INCOME.length)],
      education: EDUCATION[Math.floor(Math.random() * EDUCATION.length)],
      preferredParty,
      mainIssue: ISSUES[Math.floor(Math.random() * ISSUES.length)],
      satisfactionScore,
      sentiment,
      comment: "I am concerned about " + ISSUES[Math.floor(Math.random() * ISSUES.length)].toLowerCase() + " in my region.",
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return data;
}
