// 服务二级页面默认内容（可被 Firebase CMS 覆盖）
const servicePages = {
  'reality-check': {
    slug: 'reality-check',
    navLabel: 'Supplier Reality Check™ — $95',
    title: 'Supplier Reality Check',
    badge: '$95 · 2 business days · One supplier per check',
    heroTitle: 'Find out who you\'re really paying — before you wire a cent.',
    heroDescription: 'A 1–2 page written verdict on any Chinese supplier. License, ownership, registered address, lawsuits, business scope, and bank cross-check — delivered in 2 business days. No screenshots. No spreadsheet dumps. A real report, signed by our China Hub Manager.',
    image: { src: '', width: 800, height: 400, label: 'Hero image (800×400 recommended)' },
    sections: [
      {
        title: 'What\'s in the report',
        type: 'features',
        items: [
          { title: 'Business license verification', desc: 'Active, registered, and matched to the entity name on the PI.' },
          { title: 'Legal person & ownership', desc: 'Who actually runs the company — and what other companies they\'re tied to.' },
          { title: 'Registered vs. mailing address', desc: 'Real factory or shell office? We compare both.' },
          { title: 'Business scope', desc: 'Licensed to manufacture or sell. Often the first lie.' },
          { title: 'Lawsuit history', desc: 'Active and historical legal cases, listed by case type and year.' },
          { title: 'Operational risk flags', desc: 'Patterns we\'ve seen 100+ times that signal trouble before it hits.' },
          { title: 'Bank account cross-check', desc: 'Does the bank match the entity? HK, BVI, and Samoa accounts get flagged.' },
          { title: 'Written commercial interpretation', desc: 'What the data actually means — in plain English. One verdict you can act on.' }
        ]
      },
      {
        title: 'What we need from you',
        type: 'steps',
        items: [
          { title: 'Company name', desc: 'Chinese characters preferred. English accepted. We cross-check both against the registry.' },
          { title: 'Registered address', desc: 'From their PI, contract, or website. We compare it to the legal registration on file.' },
          { title: 'Bank details', desc: 'Account name, bank name, and country. Most fraud signals live here.' }
        ]
      },
      {
        title: 'What this isn\'t',
        type: 'list',
        items: [
          'Not a free sales call',
          'Not a generic credit report',
          'Not a sourcing recommendation',
          'Not opinion — every line is backed by Chinese registry data plus on-the-ground verification logic'
        ]
      },
      {
        title: 'Frequently Asked Questions',
        type: 'faq',
        items: [
          { q: 'How fast is delivery?', a: 'Two business days from the moment you submit company name, address, and bank details.' },
          { q: 'What if you find nothing?', a: 'You\'ll know in your verdict. We\'ve caught shell offices, dissolved entities, and cloned licenses. The $95 covers the search either way.' },
          { q: 'Does the supplier know?', a: 'No. Reality Checks are silent. The supplier doesn\'t know they\'re being verified.' },
          { q: 'What language is the report in?', a: 'English. Source data is Chinese. We translate every relevant line and include the original where it matters.' }
        ]
      }
    ],
    ctaText: 'Run a $95 Supplier Reality Check',
    ctaLink: '#contact'
  },

  'due-diligence': {
    slug: 'due-diligence',
    navLabel: 'Due Diligence',
    title: 'Due Diligence',
    badge: 'Before money moves · From $95 · Reports in 2 business days',
    heroTitle: 'Most importers don\'t lose money on bad products. They lose it on bad suppliers.',
    heroDescription: 'A "factory" with a Hong Kong bank account. A registered address that\'s an empty office. A legal person tied to two failed companies. An active lawsuit they didn\'t mention. We verify all of it — on paper, on the ground, in Chinese.',
    image: { src: '', width: 800, height: 400, label: 'Hero image (800×400 recommended)' },
    sections: [
      {
        title: 'Three levels of verification',
        type: 'pricing',
        tiers: [
          { name: 'Supplier Reality Check — $95', desc: 'A 1–2 page written verdict on any Chinese supplier. Delivered in 2 business days. Business license, legal person, ownership, registered vs. mailing address, business scope, and active lawsuits.', features: ['Remote delivery in 2 business days', 'Business license verification', 'Legal person & ownership check', 'Lawsuit history', 'Bank account cross-check'] },
          { name: 'Factory Reality Check — $795', desc: 'A China Agent inspector walks the factory, photographs the production line, geo-tags the location, and signs a report. Real building, real workers, real machines, real proof.', features: ['On-site factory inspection', 'Geo-tagged photography', 'Production line verification', 'Decision-maker identification', 'Signed field report'] },
          { name: 'Deep Dive Legal — $995', desc: 'For high-stakes deals: full legal verification. We pull court records, cross-reference the legal person\'s other companies, and write a commercial interpretation a lawyer can defend.', features: ['Full court record search', 'Legal person cross-reference', 'Customs export history (where available)', 'Commercial interpretation by legal partner', '7-10 business days'] }
        ]
      },
      {
        title: 'Frequently Asked Questions',
        type: 'faq',
        items: [
          { q: 'What\'s the difference between $95 and $795?', a: 'The $95 is paper-only — license, ownership, lawsuits, bank check, delivered remotely in 2 days. The $795 includes everything in $95, plus a real inspector physically walks the factory and writes a field report with photos.' },
          { q: 'How long does each tier take?', a: '$95: 2 business days. $795: 5–7 business days (includes scheduling). $995: 7–10 business days (court records take time).' },
          { q: 'Are the checks confidential?', a: '$95 and $995 reports are silent — the supplier never knows. The $795 on-site visit is identified but we don\'t disclose the buyer\'s identity unless authorized.' },
          { q: 'What if the supplier checks out fine?', a: 'The fee covers the search either way. You pay for proof — not for a problem. A clean report is just as valuable as a red-flagged one.' }
        ]
      }
    ],
    ctaText: 'Start Due Diligence',
    ctaLink: '#contact'
  },

  'contracts': {
    slug: 'contracts',
    navLabel: 'Contracts',
    title: 'Contracts',
    badge: 'Make it enforceable · From $595 · 4 tiers · Chinese-court ready',
    heroTitle: 'A contract that holds up in China. Not just on paper.',
    heroDescription: 'Most "China contracts" are English-language documents signed by a Chinese factory. They look enforceable. They aren\'t. We draft, translate, file, and enforce — in Chinese, under Chinese contract law, with the factory\'s chop.',
    image: { src: '', width: 800, height: 400, label: 'Hero image (800×400 recommended)' },
    sections: [
      {
        title: 'What "enforceable in China" actually means',
        type: 'features',
        items: [
          { title: 'Drafted under Chinese law', desc: 'Not a translated US contract. A document drafted from the start under Chinese contract law, by Chinese lawyers, for Chinese courts.' },
          { title: 'Bilingual, Chinese as controlling language', desc: 'English version for you. Chinese version for the factory. Chinese is the legally controlling text.' },
          { title: 'Verified company chop', desc: 'A Chinese contract isn\'t valid without the company chop. We confirm the chop matches the registered legal entity.' },
          { title: 'Enforceable jurisdiction', desc: 'Most international arbitration clauses don\'t work in Chinese courts. We use jurisdiction language Chinese courts will actually enforce.' }
        ]
      },
      {
        title: 'Contract tiers',
        type: 'pricing',
        tiers: [
          { name: 'Pre-Wire Review — $595', desc: 'Before you wire the deposit, we read the order document. We send it back marked up with the clauses you need to add. 2 business days.', features: ['Light supplier check', 'PI/PO marked up with clauses', 'NNN basics, payment terms, IP protection', 'Written explanation of each clause'] },
          { name: 'PO/PI Contract — $1,295', desc: 'Full contract language embedded in your PO/PI. Bilingual, NNN clauses, quality + delivery + penalty terms, Chinese court jurisdiction.', features: ['Bilingual contract language', 'NNN (Non-disclosure, Non-use, Non-circumvention)', 'Quality + delivery + penalty terms', 'Chop verification logic built in'] },
          { name: 'MASTER Contract — $1,995', desc: 'The standalone master contract. Signed once. Every future PO references it. Persists across multiple orders.', features: ['Standalone bilingual master contract', 'Signed and chopped separately', 'Persists across multiple POs', 'We coordinate chop with supplier'] },
          { name: 'Manufacturing Agreement — $2,650', desc: 'MASTER Contract + manufacturing-specific terms: line allocation, mold ownership, raw material traceability, confidentiality.', features: ['Everything in MASTER Contract', 'Manufacturing-specific terms', 'Raw material sourcing + traceability', 'Reviewed by senior legal partner'] }
        ]
      }
    ],
    ctaText: 'Get Contract Protection',
    ctaLink: '#contact'
  },

  'guided-visits': {
    slug: 'guided-visits',
    navLabel: 'Guided Visits',
    title: 'Guided Visits',
    badge: 'When you fly in · Pass-through transparent · 7-day lead time',
    heroTitle: 'You fly in. We\'ve already done the homework.',
    heroDescription: 'Most "factory tours" in China are sourcing trips dressed up as travel. A China Agent Guided Visit is built around YOUR suppliers — ones you\'re considering, ones we\'ve verified, or ones you\'ve worked with and finally want to meet in person.',
    image: { src: '', width: 800, height: 400, label: 'Hero image (800×400 recommended)' },
    sections: [
      {
        title: 'How it works',
        type: 'steps',
        items: [
          { title: 'Pre-trip due diligence', desc: 'We run due diligence on every supplier on your list. Confirm decision-makers will be in the room — not just sales staff.' },
          { title: 'Logistics & coordination', desc: 'Driver and translator booked, vetted, and on call. Daily oversight. Daily summary. The schedule is yours, the logistics are us.' },
          { title: 'Bolt-on experts', desc: 'Optional: QC engineer for technical reviews, Chinese lawyer for on-the-spot NNN signing, senior negotiator for hard conversations.' },
          { title: 'Trip file & deliverables', desc: 'Factory scorecards, photos, decisions made, next steps, signed agreements. The trip ends. The file lives.' }
        ]
      },
      {
        title: 'Trip lengths',
        type: 'pricing',
        tiers: [
          { name: '3-Day Visit — $2,950', desc: 'Single hub. 1–2 factories. Best for focused buyers who already know who they\'re meeting.', features: ['Pre-trip due diligence on listed suppliers', 'Driver + translator included', 'Single hub logistics'] },
          { name: '5-Day Visit — $4,950', desc: 'Single hub or two close hubs. 3–5 factories. The standard buyer trip.', features: ['Multi-factory schedule with travel logistics', 'Mid-trip schedule adjustment', 'Driver + translator included'] },
          { name: '7-Day Visit — $6,950', desc: '3–4 hubs across multiple regions. Up to 6 factories total. For buyers covering multiple production zones.', features: ['Multi-region logistics', 'Optional market visits and Canton Fair days', 'Driver + translator included'] }
        ]
      }
    ],
    ctaText: 'Plan a Guided Visit',
    ctaLink: '#contact'
  },

  'fixer': {
    slug: 'fixer',
    navLabel: 'Fixer',
    title: 'Fixer',
    badge: 'When something broke · From $795 · 4 tiers · We show up where emails stop working',
    heroTitle: 'The supplier stopped replying. The shipment is wrong. The deposit is gone.',
    heroDescription: 'Most disputes with Chinese factories don\'t get resolved over email. They get resolved when someone walks into the factory. We sit with the factory owner. Not the sales rep. The owner. In Chinese. In the building.',
    image: { src: '', width: 800, height: 400, label: 'Hero image (800×400 recommended)' },
    sections: [
      {
        title: 'What a Fixer engagement looks like',
        type: 'steps',
        items: [
          { title: '1. Document review', desc: 'The contract (or what\'s missing from it). The PI. The PO. The chat history. The shipping documents. The payment records. The product photos before and after.' },
          { title: '2. On-site intervention', desc: 'Not a phone call. Not a video meeting. A representative drives to the factory and sits across from the owner — in Chinese, with full context, with the file in hand.' },
          { title: '3. Recovery assessment', desc: 'Some disputes are 100% recoverable. Some are 30%. Some are zero. We don\'t promise outcomes — we tell you the truth, fast.' },
          { title: '4. Resolution', desc: 'Smaller disputes end with a written assessment. Mid-disputes end with negotiated recovery. Full engagements include sustained on-site presence and legal coordination.' }
        ]
      },
      {
        title: 'Tiers',
        type: 'pricing',
        tiers: [
          { name: 'Quick Dispute Review — $795', desc: 'Diagnostic-only. You send documents. We write back with assessment: what happened, what\'s recoverable, your real options. 2–3 business days.', features: ['Full document review', 'Written diagnostic', 'Recovery probability assessment', 'No supplier contact'] },
          { name: 'Tier 2 Negotiation — from $1,950', desc: 'Active intervention. Direct negotiation with factory owner. Chinese-language pressure correspondence. Documented agreement.', features: ['Direct negotiation with factory owner', 'Chinese-language correspondence', 'Documented agreement (English + Chinese, chopped)', 'On-site presence as needed'] },
          { name: 'Full Fixer — Custom Quote', desc: 'Sustained intervention until the matter is closed. Best for high-stakes disputes or cases needing a permanent China-side representative.', features: ['Sustained on-site presence (up to 30 days)', 'Coordinated legal escalation if required', 'Recovery execution', 'Final close-out report'] }
        ]
      }
    ],
    ctaText: 'Start a Fixer Case',
    ctaLink: '#contact'
  }
};

export default servicePages;
