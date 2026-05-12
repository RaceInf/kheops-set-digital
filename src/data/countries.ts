export interface Country {
  code: string;
  name: string;
  dialCode: string;
  format: string;
  emoji?: string;
}

export const countries: Country[] = [
  {
    code: 'CM',
    name: 'Cameroun',
    dialCode: '+237',
    format: 'XXXX XXXXXX',
    emoji: '🇨🇲'
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    format: 'X XX XX XX XX',
    emoji: '🇫🇷'
  },
  {
    code: 'US',
    name: 'États-Unis',
    dialCode: '+1',
    format: 'XXX XXX XXXX',
    emoji: '🇺🇸'
  },
  {
    code: 'GB',
    name: 'Royaume-Uni',
    dialCode: '+44',
    format: 'XXXX XXXXXX',
    emoji: '🇬🇧'
  },
  {
    code: 'DE',
    name: 'Allemagne',
    dialCode: '+49',
    format: 'XXXX XXXXXXX',
    emoji: '🇩🇪'
  },
  {
    code: 'BE',
    name: 'Belgique',
    dialCode: '+32',
    format: 'XXX XX XX XX',
    emoji: '🇧🇪'
  },
  {
    code: 'SN',
    name: 'Sénégal',
    dialCode: '+221',
    format: 'XX XXX XXXX',
    emoji: '🇸🇳'
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    dialCode: '+225',
    format: 'XX XXX XXXX',
    emoji: '🇨🇮'
  }
]; 