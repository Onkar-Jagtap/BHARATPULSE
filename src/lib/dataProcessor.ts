export interface VoterRecord {
  id: string;
  state: string;
  district: string;
  constituency: string;
  age: number | string;
  gender: 'Male' | 'Female' | 'Other' | 'Unknown';
  occupation: string;
  incomeGroup: string;
  education: string;
  preferredParty: string;
  mainIssue: string;
  satisfactionScore: number;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  comment: string;
  date: string;
}

export interface ProcessingStats {
  total: number;
  cleaned: number;
  invalid: number;
  duplicates: number;
  qualityScore: number;
}

export function processSurveyData(raw: any[]): { data: VoterRecord[], stats: ProcessingStats } {
  let stats: ProcessingStats = {
    total: raw.length,
    cleaned: 0,
    invalid: 0,
    duplicates: 0,
    qualityScore: 100
  };

  const seen = new Set<string>();
  const cleanedData: VoterRecord[] = [];

  raw.forEach((item, index) => {
    // Robust Header Detection
    const recordState = item.State || item.state || item.STATE || item.province;
    const recordConstituency = item.Constituency || item.constituency || item.CONSTITUENCY || item.region;
    
    // Basic validation - must have state and constituency
    if (!recordState || !recordConstituency) {
      stats.invalid++;
      return;
    }

    // Deduplication Key
    const comment = item.Comment || item.comment || item.voterComment || item.voter_comment || '';
    const key = `${recordState}-${recordConstituency}-${comment}-${index}`;
    if (seen.has(key)) {
      stats.duplicates++;
      return;
    }
    seen.add(key);

    // Normalization & Cleaning
    const ageRaw = item.Age || item.age || item.AGE;
    const age = parseInt(ageRaw);
    const scoreRaw = item.SatisfactionScore || item.satisfactionScore || item.satisfaction_score || item.score || item.satisfaction;
    const score = parseFloat(scoreRaw);
    
    const record: VoterRecord = {
      id: Math.random().toString(36).substr(2, 9),
      state: String(recordState).trim(),
      district: String(item.District || item.district || item.DISTRICT || 'Unknown').trim(),
      constituency: String(recordConstituency).trim(),
      age: isNaN(age) || age < 18 || age > 120 ? 'Unknown' : age,
      gender: item.Gender || item.gender || item.GENDER || 'Unknown',
      occupation: item.Occupation || item.occupation || item.OCCUPATION || 'Service',
      incomeGroup: item.IncomeGroup || item.incomeGroup || item.income_group || item.income || 'Unknown',
      education: item.Education || item.education || item.EDUCATION || 'Unknown',
      preferredParty: item.PreferredParty || item.preferredParty || item.preferred_party || item.party || 'Undecided',
      mainIssue: item.MainIssue || item.mainIssue || item.main_issue || item.issue || 'General Governance',
      satisfactionScore: isNaN(score) ? 5 : Math.min(10, Math.max(0, score)),
      sentiment: determineSentiment(item, isNaN(score) ? 5 : score),
      comment: String(comment).trim(),
      date: item.Date || item.date || item.surveyDate || item.survey_date || new Date().toISOString()
    };

    if (record.age === 'Unknown' || record.preferredParty === 'Undecided' || record.preferredParty === 'Unknown') {
      stats.cleaned++;
    }

    cleanedData.push(record);
  });

  stats.total = raw.length;
  stats.qualityScore = stats.total > 0 
    ? Math.max(0, 100 - ((stats.invalid + stats.cleaned / 2) / stats.total) * 100) 
    : 100;

  return { data: cleanedData, stats };
}

function determineSentiment(item: any, score: number): 'Positive' | 'Negative' | 'Neutral' {
  const sentimentRaw = item.Sentiment || item.sentiment || item.SENTIMENT;
  if (sentimentRaw) {
    const s = String(sentimentRaw).toLowerCase();
    if (s.includes('pos')) return 'Positive';
    if (s.includes('neg')) return 'Negative';
    if (s.includes('neu')) return 'Neutral';
  }

  if (score > 7) return 'Positive';
  if (score < 4) return 'Negative';
  return 'Neutral';
}
