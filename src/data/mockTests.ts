import { MockTest, Flashcard, SampleEssay } from '../types';

export const mockTestsDatabase: MockTest[] = [
  {
    id: 'ielts-mock-01',
    title: 'IELTS Academic Master Simulator — Practice Set 1',
    examType: 'academic',
    difficulty: 'Intermediate',
    durationMinutes: 160,
    listening: [
      {
        part: 1,
        title: 'University Accommodation Booking',
        situation: 'A student calling the university housing office to reserve a room for the upcoming autumn semester.',
        audioPrompt: 'Good morning, University Housing Office, Sarah speaking. How can I help you today? Hello, I would like to enquire about student accommodation for the autumn term. My name is Alex Turner. That is T-U-R-N-E-R. And what course are you studying, Alex? I am enrolled in Environmental Engineering. Great. We have three main halls available: Victoria Hall, Elm Park, and South View. Victoria Hall has en-suite bathrooms and costs 165 pounds per week, including all utilities and high-speed internet. Elm Park is 135 pounds, but kitchens are shared among four students. South View is closest to the engineering faculty, approximately a seven-minute walk. I think South View would suit me best. What is the deposit required? The refundable deposit is 250 pounds, payable by the 15th of August.',
        transcript: `OFFICER: Good morning, University Housing Office, Sarah speaking. How can I help you today?
STUDENT: Hello, I would like to enquire about student accommodation for the autumn term. My name is Alex Turner. That is T-U-R-N-E-R.
OFFICER: And what course are you studying, Alex?
STUDENT: I am enrolled in Environmental Engineering.
OFFICER: Great. We have three main halls available: Victoria Hall, Elm Park, and South View. Victoria Hall has en-suite bathrooms and costs 165 pounds per week, including all utilities and high-speed internet. Elm Park is 135 pounds, but kitchens are shared among four students. South View is closest to the engineering faculty, approximately a seven-minute walk.
STUDENT: I think South View would suit me best. What is the deposit required?
OFFICER: The refundable security deposit is 250 pounds, payable by the 15th of August.`,
        questions: [
          {
            id: 'l1-q1',
            type: 'form_filling',
            prompt: 'Applicant surname: Alex [_____]',
            correctAnswer: 'Turner',
            explanation: 'The candidate spells out his surname: T-U-R-N-E-R.'
          },
          {
            id: 'l1-q2',
            type: 'multiple_choice',
            prompt: 'Which degree course will Alex be attending?',
            options: [
              'Mechanical Engineering',
              'Environmental Engineering',
              'Electrical Engineering',
              'Civil Architecture'
            ],
            correctAnswer: 'Environmental Engineering',
            explanation: 'Alex explicitly states: "I am enrolled in Environmental Engineering."'
          },
          {
            id: 'l1-q3',
            type: 'multiple_choice',
            prompt: 'How long is the walk from South View hall to the engineering faculty?',
            options: [
              '5 minutes',
              '7 minutes',
              '12 minutes',
              '15 minutes'
            ],
            correctAnswer: '7 minutes',
            explanation: 'The officer mentions it is "approximately a seven-minute walk."'
          },
          {
            id: 'l1-q4',
            type: 'form_filling',
            prompt: 'Refundable security deposit amount: £[_____]',
            correctAnswer: '250',
            explanation: 'The officer specifies: "The refundable security deposit is 250 pounds."'
          }
        ]
      },
      {
        part: 2,
        title: 'New Campus Innovation Center Orientation',
        situation: 'A speech by the facility coordinator welcoming international postgraduate students.',
        audioPrompt: 'Welcome everyone to the Apex Innovation Center. Before we tour the robotics lab, let me point out the core facilities on the ground floor. Directly opposite the main entrance is the reception desk. If you turn left, you will find the 24-hour quiet study commons, equipped with noise-canceling booths. On the right-hand corridor is the digital media suite where podcasting and VR equipment can be booked via the campus app. Please note that safety goggles must be worn at all times inside the prototyping workshop on the second floor. Lockers are available for 10 pounds per semester.',
        transcript: `COORDINATOR: Welcome everyone to the Apex Innovation Center. Before we tour the robotics lab, let me point out the core facilities on the ground floor. Directly opposite the main entrance is the reception desk. If you turn left, you will find the 24-hour quiet study commons, equipped with noise-canceling booths. On the right-hand corridor is the digital media suite where podcasting and VR equipment can be booked via the campus app. Please note that safety goggles must be worn at all times inside the prototyping workshop on the second floor. Lockers are available for 10 pounds per semester.`,
        questions: [
          {
            id: 'l2-q1',
            type: 'multiple_choice',
            prompt: 'What facility is located directly to the left of the main entrance?',
            options: [
              'Digital media suite',
              'Quiet study commons',
              'Robotics prototyping workshop',
              'Cafeteria lounge'
            ],
            correctAnswer: 'Quiet study commons',
            explanation: 'The speaker says: "If you turn left, you will find the 24-hour quiet study commons."'
          },
          {
            id: 'l2-q2',
            type: 'multiple_choice',
            prompt: 'What equipment must students wear inside the prototyping workshop?',
            options: [
              'Anti-static wristbands',
              'Safety goggles',
              'Lab coats and steel-toe boots',
              'Ear defenders'
            ],
            correctAnswer: 'Safety goggles',
            explanation: 'The coordinator highlights: "safety goggles must be worn at all times inside the prototyping workshop."'
          }
        ]
      },
      {
        part: 3,
        title: 'Seminar on Lithium-Sulfur Battery Technology',
        situation: 'Two research students and their academic supervisor discussing renewable storage constraints.',
        audioPrompt: 'Dr. Evans: Good afternoon Liam and Clara. Let us review your progress on next-generation battery chemistry. Liam, what did the electrochemical impedance spectroscopy indicate? Liam: Well, our lithium-sulfur prototypes showed nearly triple the theoretical gravimetric energy density of standard lithium-ion cells. However, the polysulfide shuttle effect caused rapid capacity fading after just 120 cycles. Clara: Exactly. To address this degradation, we synthesized a porous graphene oxide interlayer. This membrane successfully trapped soluble polysulfides and boosted cycle retention to over 85 percent across 500 charge cycles.',
        transcript: `DR. EVANS: Good afternoon Liam and Clara. Let us review your progress on next-generation battery chemistry. Liam, what did the electrochemical impedance spectroscopy indicate?
LIAM: Well, our lithium-sulfur prototypes showed nearly triple the theoretical gravimetric energy density of standard lithium-ion cells. However, the polysulfide shuttle effect caused rapid capacity fading after just 120 cycles.
CLARA: Exactly. To address this degradation, we synthesized a porous graphene oxide interlayer. This membrane successfully trapped soluble polysulfides and boosted cycle retention to over 85 percent across 500 charge cycles.`,
        questions: [
          {
            id: 'l3-q1',
            type: 'multiple_choice',
            prompt: 'What was the primary advantage of the lithium-sulfur prototypes over lithium-ion cells?',
            options: [
              'Lower raw material cost',
              'Triple the energy density',
              'Zero fire hazard risk',
              'Instantaneous charging speed'
            ],
            correctAnswer: 'Triple the energy density',
            explanation: 'Liam says the prototypes showed "nearly triple the theoretical gravimetric energy density of standard lithium-ion cells."'
          },
          {
            id: 'l3-q2',
            type: 'multiple_choice',
            prompt: 'How did Clara solve the polysulfide shuttle effect problem?',
            options: [
              'By replacing the liquid electrolyte with solid polymer',
              'By synthesizing a porous graphene oxide interlayer',
              'By reducing the operating temperature',
              'By decreasing the discharge rate'
            ],
            correctAnswer: 'By synthesizing a porous graphene oxide interlayer',
            explanation: 'Clara says: "we synthesized a porous graphene oxide interlayer. This membrane successfully trapped soluble polysulfides."'
          }
        ]
      },
      {
        part: 4,
        title: 'Lecture: Autonomous Logistics and Urban Airspace',
        situation: 'An academic university lecture discussing unmanned aerial vehicles (UAVs) in urban package delivery.',
        audioPrompt: 'Today we examine the logistical architecture required for commercial drone delivery in metropolitan areas. While small-payload aerial deliveries promise substantial reductions in last-mile vehicular emissions, two fundamental engineering bottlenecks remain: acoustic disturbance and dynamic micro-weather turbulence. Low-frequency rotor hum creates significant psychoacoustic fatigue in densely populated suburbs. Furthermore, high-rise urban canyons generate complex wind vortices that challenge automated flight stability algorithms.',
        transcript: `PROFESSOR: Today we examine the logistical architecture required for commercial drone delivery in metropolitan areas. While small-payload aerial deliveries promise substantial reductions in last-mile vehicular emissions, two fundamental engineering bottlenecks remain: acoustic disturbance and dynamic micro-weather turbulence. Low-frequency rotor hum creates significant psychoacoustic fatigue in densely populated suburbs. Furthermore, high-rise urban canyons generate complex wind vortices that challenge automated flight stability algorithms.`,
        questions: [
          {
            id: 'l4-q1',
            type: 'multiple_choice',
            prompt: 'According to the lecturer, what is a primary ecological benefit of drone delivery?',
            options: [
              'Less packaging waste',
              'Reductions in last-mile vehicular emissions',
              'Elimination of suburban warehouses',
              'Lower electricity grid demand'
            ],
            correctAnswer: 'Reductions in last-mile vehicular emissions',
            explanation: 'The professor mentions "substantial reductions in last-mile vehicular emissions."'
          },
          {
            id: 'l4-q2',
            type: 'form_filling',
            prompt: 'Urban high-rises create wind [_____] that disrupt automated flight algorithms.',
            correctAnswer: 'vortices',
            explanation: 'The professor notes: "high-rise urban canyons generate complex wind vortices."'
          }
        ]
      }
    ],
    reading: [
      {
        part: 1,
        title: 'Deep-Sea Ocean Exploration: The Frontier of Abyssal Submersibles',
        subtitle: 'From Bathyspheres to Autonomous Underwater Vehicles',
        content: `Paragraph A
For centuries, the ocean floor was regarded as an impenetrable, lifeless void, shrouded in total darkness and subject to crushing hydrostatic pressures reaching more than one thousand atmospheres. It was not until the early twentieth century that engineering breakthroughs allowed humans to descend into the abyss. In 1934, William Beebe and Otis Barton descended in the Bathysphere—a hollow spherical steel chamber suspended by a fragile steel cable—reaching a historic depth of 923 meters off the coast of Bermuda. Although the expedition demonstrated that deep waters were teeming with bioluminescent organisms, its physical tether to the surface ship presented grave risks; a severed cable meant certain death.

Paragraph B
The advent of untethered submersibles revolutionized abyssal oceanography. In 1960, the Swiss-designed bathyscaphe Trieste, piloted by Jacques Piccard and Don Walsh, touched down at the bottom of Challenger Deep in the Mariana Trench—the deepest recognized point on Earth at approximately 10,911 meters. The Trieste employed a massive float filled with gasoline, which is lighter than water and virtually incompressible, alongside detachable iron pellets held by electromagnets for ballast. While triumphant, the Trieste was cumbersome, requiring hours to descend and ascend, and offered virtually no horizontal mobility for scientific sampling.

Paragraph C
Modern deep-sea research is increasingly spearheaded by Autonomous Underwater Vehicles (AUVs) and Remotely Operated Vehicles (ROVs). ROVs remain linked to surface vessels via fiber-optic umbilical cords that transmit high-voltage power and real-time gigabit data, allowing marine biologists to operate multi-jointed robotic arms with sub-millimeter precision. Conversely, AUVs operate without human intervention, navigating by acoustic Doppler velocity logs, inertial navigation systems, and synthetic aperture sonar to map thousands of square kilometers of seabed with topographic resolution previously only possible on dry land.

Paragraph D
One of the most consequential discoveries resulting from submersible voyages was the identification of hydrothermal vents along mid-ocean ridges in 1977. Scientists discovered flourishing ecosystems thriving in superheated mineral-laden water devoid of sunlight. Unlike terrestrial and surface marine organisms, whose primary energy is derived from solar photosynthesis, hydrothermal vent organisms rely on chemosynthesis. Bacteria oxidize hydrogen sulfide gushing from volcanic vents, establishing the foundation of a food web that sustains giant tube worms (Riftia pachyptila), translucent crabs, and ghost shrimp.

Paragraph E
Despite these technological milestones, more than eighty percent of Earth's ocean floor remains unmapped with high-resolution bathymetry. Marine geologists argue that the topography of Mars and the Moon is cataloged with greater fidelity than our own planet's ocean basins. Deep-sea exploration faces mounting urgency today as commercial entities develop deep-sea mining technologies to extract polymetallic nodules containing copper, nickel, cobalt, and rare earth minerals essential for electric vehicles and green technology. Environmentalists caution that dredging the abyssal plains could irreversibly disrupt slow-growing benthic organisms and release sediment plumes that choke pelagic filter feeders for centuries.`,
        questions: [
          {
            id: 'r1-q1',
            type: 'true_false_not_given',
            prompt: 'The Bathysphere had an engine that allowed it to steer horizontally underwater.',
            correctAnswer: 'False',
            explanation: 'Paragraph A states the Bathysphere was a "steel chamber suspended by a fragile steel cable", with no mention of independent propulsion.'
          },
          {
            id: 'r1-q2',
            type: 'true_false_not_given',
            prompt: 'The Trieste utilized gasoline because gasoline is lighter than water and resists compression under high pressure.',
            correctAnswer: 'True',
            explanation: 'Paragraph B explicitly says: "gasoline, which is lighter than water and virtually incompressible".'
          },
          {
            id: 'r1-q3',
            type: 'true_false_not_given',
            prompt: 'Jacques Piccard received an international award for oceanography following his 1960 expedition.',
            correctAnswer: 'Not Given',
            explanation: 'The text describes the expedition but does not mention any awards received by Piccard.'
          },
          {
            id: 'r1-q4',
            type: 'multiple_choice',
            prompt: 'How do hydrothermal vent ecosystems fundamentally differ from surface ecosystems?',
            options: [
              'They do not require water to thrive',
              'Their primary energy is derived from chemosynthesis instead of sunlight',
              'They are comprised solely of single-cell bacteria',
              'They reproduce much faster than surface organisms'
            ],
            correctAnswer: 'Their primary energy is derived from chemosynthesis instead of sunlight',
            explanation: 'Paragraph D states: "Unlike terrestrial and surface marine organisms... hydrothermal vent organisms rely on chemosynthesis."'
          },
          {
            id: 'r1-q5',
            type: 'sentence_completion',
            prompt: 'Paragraph E notes that scientists have mapped the surface of [_____] with higher fidelity than our ocean floors.',
            correctAnswer: 'Mars',
            explanation: 'Paragraph E states: "topography of Mars and the Moon is cataloged with greater fidelity than our own planet\'s ocean basins."'
          }
        ]
      },
      {
        part: 2,
        title: 'Neurolinguistics and the Multilingual Brain',
        subtitle: 'Cognitive Reserve, Executive Function, and Neural Plasticity',
        content: `Paragraph A
For the better part of the twentieth century, pediatricians and educators cautioned that exposing young children to multiple languages would induce "linguistic confusion," impede native vocabulary acquisition, and hamper academic trajectory. However, rigorous neuroimaging studies over the past twenty-five years have dismantled this presumption. Functional Magnetic Resonance Imaging (fMRI) reveals that acquiring two or more languages fundamentally reshapes neural architecture, yielding enhanced cognitive control, superior mental flexibility, and delayed onset of neurodegenerative symptoms in late adulthood.

Paragraph B
At the core of the multilingual cognitive advantage lies executive function—the suite of top-down cognitive processes managed primarily by the prefrontal cortex and anterior cingulate cortex. Whenever a bilingual individual speaks, both linguistic systems remain simultaneously active in the brain. For instance, when a bilingual Spanish-English speaker intends to say the word "apple," the neural pathways for both "apple" and "manzana" are co-activated. Consequently, the brain must continuously exercise inhibitory control to suppress the intrusive language while monitoring communicative context. This lifelong neural workout strengthens attentional switching mechanisms.

Paragraph C
The cognitive dividends of this ongoing bilingual competition manifest in non-linguistic tasks as well. Experimental paradigms such as the Simon Task and the Stroop Color and Word Test demonstrate that bilinguals consistently resolve conflicting perceptual cues faster and with fewer errors than monolinguals. Furthermore, structural neuroimaging indicates increased gray matter volume in the left inferior parietal cortex and enhanced white matter integrity along the superior longitudinal fasciculus in individuals who use multiple languages daily.

Paragraph D
Perhaps the most striking clinical observation is the phenomenon known as "cognitive reserve." Epidemiological investigations conducted by neuropsychologist Dr. Ellen Bialystok and colleagues across diverse clinical cohorts found that lifelong bilingual patients were diagnosed with Alzheimer\'s disease symptoms an average of four to five years later than monolingual counterparts with identical neurodegenerative brain pathology. Although bilingualism does not prevent the underlying amyloid plaques from forming, the reinforced executive control network enables the brain to recruit compensatory neural pathways, maintaining functional independence for longer.`,
        questions: [
          {
            id: 'r2-q1',
            type: 'yes_no_not_given',
            prompt: 'In the 20th century, early researchers widely recommended raising children bilingually.',
            correctAnswer: 'No',
            explanation: 'Paragraph A states that educators and pediatricians "cautioned that exposing young children to multiple languages would induce linguistic confusion".'
          },
          {
            id: 'r2-q2',
            type: 'yes_no_not_given',
            prompt: 'When a multilingual person speaks, the unused language remains completely deactivated in the brain.',
            correctAnswer: 'No',
            explanation: 'Paragraph B explicitly notes: "both linguistic systems remain simultaneously active in the brain."'
          },
          {
            id: 'r2-q3',
            type: 'multiple_choice',
            prompt: 'According to Dr. Bialystok\'s research, how does bilingualism influence Alzheimer\'s disease?',
            options: [
              'It completely eliminates amyloid plaque buildup',
              'It delays the manifestation of clinical symptoms by 4-5 years',
              'It reverses neurodegenerative memory damage',
              'It only protects individuals who learn languages before age 5'
            ],
            correctAnswer: 'It delays the manifestation of clinical symptoms by 4-5 years',
            explanation: 'Paragraph D states: "lifelong bilingual patients were diagnosed with Alzheimer\'s disease symptoms an average of four to five years later."'
          }
        ]
      }
    ],
    writing: [
      {
        taskNumber: 1,
        examType: 'academic',
        title: 'Task 1 (Academic): Global Renewable Energy Consumption by Source',
        prompt: 'The chart and table below give information regarding the consumption of renewable energy (solar, wind, hydroelectric, and biomass) in gigawatt-hours (GWh) across five global regions between 2012 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
        chartType: 'bar',
        chartData: {
          labels: ['2012', '2015', '2018', '2021', '2024'],
          datasets: [
            { source: 'Solar PV', data: [120, 240, 580, 1020, 1680] },
            { source: 'Wind Energy', data: [310, 480, 750, 1150, 1540] },
            { source: 'Hydroelectric', data: [980, 1020, 1050, 1080, 1100] },
            { source: 'Biomass & Geothermal', data: [340, 390, 430, 470, 510] }
          ]
        },
        minWords: 150,
        timeMinutes: 20,
        sampleBand9Essay: `The bar chart and associated data outline renewable power consumption across four key sectors—solar PV, wind energy, hydroelectricity, and biomass—measured in gigawatt-hours (GWh) at triennial intervals from 2012 to 2024.

Overall, it is readily apparent that while hydroelectric generation was initially the overwhelmingly dominant clean energy source, solar photovoltaics and wind power underwent dramatic exponential surges over the twelve-year period, with solar overtaking all other sources by 2024.

In 2012, hydroelectricity produced 980 GWh, roughly triple the volume of wind (310 GWh) and biomass (340 GWh), whereas solar PV was negligible at merely 120 GWh. Over the subsequent decade, hydroelectricity expanded at a modest, plateauing rate, concluding at 1,100 GWh in 2024. Similarly, biomass rose incrementally by 50% to finish at 510 GWh.

In sharp contrast, solar energy escalated more than fourteen-fold, rising steadily to 580 GWh in 2018 before steepening dramatically to 1,680 GWh by the end of the timeframe. Wind power exhibited a parallel steep upward trajectory, climbing to 1,150 GWh in 2021 and finally plateauing at 1,540 GWh, thus cementing solar and wind as the primary drivers of renewable expansion.`,
        examinerComment: 'Band 9.0: Masterful overview clearly outlining primary trends. Precise figures reported with appropriate comparisons and sophisticated grammatical range (exponential surges, plateauing rate, in sharp contrast).'
      },
      {
        taskNumber: 2,
        examType: 'academic',
        title: 'Task 2 Essay: Artificial Intelligence in Education',
        prompt: 'Some people argue that artificial intelligence and automated tutoring systems will soon make human teachers obsolete. Others maintain that the human element of teaching is irreplaceable and vital for holistic education.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
        minWords: 250,
        timeMinutes: 40,
        sampleBand9Essay: `The rapid proliferation of sophisticated artificial intelligence in educational environments has sparked contentious debate regarding the long-term viability of human educators. While technological enthusiasts argue that automated algorithms provide unparalleled individualized pedagogy, I contend that emotional intelligence, pastoral guidance, and ethical mentorship ensure human educators remain utterly indispensable.

Advocates of algorithmic instruction emphasize the unparalleled efficiency and hyper-personalized pacing that artificial intelligence can deliver. Conventional classrooms frequently struggle with the "one-size-fits-all" limitation, where gifted pupils languish in boredom while struggling students fall hopelessly behind. In stark contrast, adaptive AI platforms can pinpoint a student’s diagnostic vulnerabilities within minutes, calibrating problem sets and explanations to their precise neural processing velocity. Furthermore, automated systems eliminate geographical disparities by democratizing top-tier instructional content to disadvantaged regions across the globe at negligible marginal cost.

Nevertheless, equating content dissemination with authentic education constitutes a reductionist fallacy. Teaching is fundamentally an empathetic endeavor requiring psychological intuition, interpersonal encouragement, and ethical stewardship. A generative language model can explain quantum physics or grammatical rules with immaculate clarity, yet it remains fundamentally incapable of discerning when a pupil is silently wrestling with personal trauma, anxiety, or domestic adversity. Human teachers instill critical thinking, inspire resilience, and model compassion—qualities that cannot be distilled into algorithmic weight vectors.

In conclusion, although artificial intelligence undoubtedly represents a revolutionary instrument for personalized content mastery and administrative grading, it should function as an assistant rather than a replacement. The profound transformative bond between pupil and teacher remains an irreplaceable pillar of human development.`,
        examinerComment: 'Band 9.0: Exemplary cohesion, sophisticated lexical dexterity (pastoral guidance, reductionist fallacy, diagnostic vulnerabilities), flawless task response with nuanced argumentation and fully substantiated stance.'
      }
    ],
    speaking: [
      {
        part: 1,
        title: 'Part 1: Introduction and Daily Life',
        instructions: 'The examiner will introduce themselves and confirm your identity, then ask general questions about familiar topics.',
        speakingTimeSeconds: 240,
        questions: [
          'What degree or occupation are you currently engaged in?',
          'How much time do you typically spend using digital devices on an average weekday?',
          'Do you prefer communicating with friends via instant messaging or in-person conversations? Why?',
          'Has your neighborhood changed significantly in recent years?'
        ]
      },
      {
        part: 2,
        title: 'Part 2: Individual Long Turn (Cue Card)',
        instructions: 'You will have 1 minute to read the cue card, prepare your ideas, and make notes on the scratchpad. Then, you should speak uninterrupted for 1 to 2 minutes.',
        prepTimeSeconds: 60,
        speakingTimeSeconds: 120,
        cueCard: {
          topic: 'Describe a technological innovation that has significantly improved your daily life.',
          points: [
            'What the technology or device is',
            'When and how you first started using it',
            'How it works in your daily routine',
            'And explain why it has had such a meaningful impact on you.'
          ]
        },
        questions: [
          'Would you say that this technology is accessible to people of all generations?',
          'Can you envision any negative consequences if society becomes overly dependent on it?'
        ]
      },
      {
        part: 3,
        title: 'Part 3: Two-Way Analytical Discussion',
        instructions: 'The examiner will ask broader, more abstract and analytical questions connected to the topic in Part 2.',
        speakingTimeSeconds: 300,
        questions: [
          'In what ways has rapid technological automation reshaped traditional career trajectories over the past decade?',
          'Do you think modern governments have an ethical responsibility to regulate artificial intelligence development?',
          'Some argue that increasing reliance on algorithms weakens our natural problem-solving abilities. To what extent do you agree or disagree?'
        ]
      }
    ]
  }
];

export const vocabularyVault: Flashcard[] = [
  {
    id: 'v1',
    word: 'Proliferation',
    phonetic: '/prəˌlɪf.əˈreɪ.ʃən/',
    pos: 'Noun',
    definition: 'Rapid increase in numbers or an intense expansion in the availability of something.',
    ieltsCollocations: ['Rapid proliferation', 'Proliferation of digital devices', 'Nuclear proliferation'],
    example: 'The rapid proliferation of generative artificial intelligence has altered academic integrity policies worldwide.',
    bandLevel: 'Band 8.5+',
    topic: 'Technology & Society'
  },
  {
    id: 'v2',
    word: 'Exacerbate',
    phonetic: '/ɪɡˈzæs.ə.beɪt/',
    pos: 'Verb',
    definition: 'To make a bad situation, problem, or negative emotion noticeably worse or more intense.',
    ieltsCollocations: ['Exacerbate existing inequalities', 'Exacerbate the crisis', 'Further exacerbate environmental damage'],
    example: 'Unregulated urban sprawl threatens to exacerbate atmospheric pollution and traffic congestion.',
    bandLevel: 'Band 8.0+',
    topic: 'Environment & Urbanization'
  },
  {
    id: 'v3',
    word: 'Indispensable',
    phonetic: '/ˌɪn.dɪˈspen.sə.bəl/',
    pos: 'Adjective',
    definition: 'Absolutely necessary, essential, or impossible to manage without.',
    ieltsCollocations: ['Indispensable tool', 'Play an indispensable role', 'Indispensable to modern life'],
    example: 'High-speed broadband connectivity has become an indispensable utility in contemporary higher education.',
    bandLevel: 'Band 8.0+',
    topic: 'Education & Technology'
  },
  {
    id: 'v4',
    word: 'Mitigate',
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    pos: 'Verb',
    definition: 'To make something less harmful, severe, or painful.',
    ieltsCollocations: ['Mitigate climate change', 'Mitigate the adverse effects', 'Mitigate risk factors'],
    example: 'Governments must implement stringent fiscal incentives to mitigate the economic repercussions of unemployment.',
    bandLevel: 'Band 8.0+',
    topic: 'Economy & Policy'
  },
  {
    id: 'v5',
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    pos: 'Adjective',
    definition: 'Found or existing everywhere simultaneously; omnipresent.',
    ieltsCollocations: ['Ubiquitous presence', 'Become ubiquitous across society', 'Ubiquitous computing'],
    example: 'Smartphones have evolved from luxury accessories into ubiquitous conduits for global commerce.',
    bandLevel: 'Band 8.5+',
    topic: 'Media & Innovation'
  },
  {
    id: 'v6',
    word: 'Detrimental',
    phonetic: '/ˌdet.rɪˈmen.təl/',
    pos: 'Adjective',
    definition: 'Causing obvious harm, disadvantage, or damage.',
    ieltsCollocations: ['Detrimental effect on', 'Have a detrimental impact', 'Proved detrimental to health'],
    example: 'Sedentary lifestyles have demonstrable detrimental effects on cardiovascular well-being.',
    bandLevel: 'Band 8.0+',
    topic: 'Health & Lifestyle'
  }
];

export const sampleEssaysVault: SampleEssay[] = [
  {
    id: 'se-1',
    taskType: 'Task 2 Essay',
    title: 'University Tuition: Free Access vs. Private Investment',
    prompt: 'Some people argue that tertiary education should be completely free for all students, funded by the state. Others believe that students should contribute to their own tuition fees. Discuss both views and give your opinion.',
    bandScore: 9.0,
    essay: `The debate over state-funded higher education versus student-subsidized tuition remains a pivotal socioeconomic issue. While proponents of universal free education argue it fosters meritocracy and socioeconomic mobility, I maintain that a balanced cost-sharing framework with progressive income-contingent repayments is both fiscally sustainable and equitable.

Those advocating fully state-sponsored university education assert that financial barriers entrench generational inequality. When tuition fees are steep, talented candidates from economically disadvantaged backgrounds are disproportionately deterred from pursuing medicine, law, and engineering. Countries with free tertiary education, such as Norway and Germany, demonstrate higher social mobility indices because admission is determined purely by academic rigor rather than familial wealth. Moreover, an educated workforce yields higher gross domestic product and generates increased tax revenues that ultimately repay the public investment.

Conversely, universal subsidization often strains government budgets and inadvertently subsidizes affluent households at the expense of working-class taxpayers. Free higher education frequently leads to underfunded university laboratories, lower professor-to-student ratios, and administrative rationing. Furthermore, tertiary graduates statistically command significantly higher lifetime earnings than non-graduates. Expecting the broader populace—many of whom did not attend university—to subsidize private career premiums is regressive. A more prudent paradigm is Australia's Higher Education Loan Program, where graduates repay tuition only after their income crosses a comfortable threshold.

In conclusion, while higher education must never become the exclusive preserve of the wealthy, fully state-funded tuition compromises institutional quality and public fairness. A hybrid loan structure with income-contingent safeguards offers the optimal synthesis of equity and academic excellence.`,
    breakdown: {
      taskAchievement: 'Band 9.0: Directly addresses all components with clear, balanced arguments, concrete national examples (Germany, Norway, Australia), and a consistent, well-reasoned stance.',
      coherence: 'Band 9.0: Seamless paragraph progression with sophisticated discourse markers (proponents assert, conversely, in conclusion, a more prudent paradigm).',
      vocabulary: 'Band 9.0: Flawless academic collocations: "entrench generational inequality", "disproportionately deterred", "regressive taxation", "lifetime earnings".',
      grammar: 'Band 9.0: Masterful syntactic variety including complex conditionals, participial clauses, and inverted structures.'
    }
  }
];
