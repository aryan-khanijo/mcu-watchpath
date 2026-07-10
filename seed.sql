-- MCU Watchpath Seed Data (Restructured)

-- ==========================================
-- SAGA 1: THE INFINITY SAGA
-- ==========================================

-- Phase 1
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('Iron Man', 'movie', 2008, 'The Infinity Saga', 'Phase 1', NULL, 'Where it all began — Tony Stark builds the suit that starts a universe.', 1, 0, 0, 0, NULL, NULL, 1, 0),
('The Incredible Hulk', 'movie', 2008, 'The Infinity Saga', 'Phase 1', NULL, 'Bruce Banner''s origin and the military''s super-soldier obsession.', 2, 0, 0, 0, NULL, NULL, 1, 0),
('Iron Man 2', 'movie', 2010, 'The Infinity Saga', 'Phase 1', NULL, 'Stark faces new rivals while SHIELD expands its reach.', 3, 0, 0, 0, NULL, NULL, 1, 0),
('Thor', 'movie', 2011, 'The Infinity Saga', 'Phase 1', NULL, 'The God of Thunder is banished to Earth — Asgard meets the MCU.', 4, 0, 0, 0, NULL, NULL, 1, 0),
('Captain America: The First Avenger', 'movie', 2011, 'The Infinity Saga', 'Phase 1', NULL, 'Steve Rogers becomes a super-soldier in WWII — a hero out of time.', 5, 0, 0, 0, NULL, NULL, 1, 0),
('The Avengers', 'movie', 2012, 'The Infinity Saga', 'Phase 1', NULL, 'Earth''s Mightiest Heroes assemble for the first time against Loki.', 6, 0, 0, 0, NULL, NULL, 1, 0);

-- Phase 2
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('Iron Man 3', 'movie', 2013, 'The Infinity Saga', 'Phase 2', NULL, 'Tony Stark faces PTSD and the Mandarin after the Battle of New York.', 7, 0, 0, 0, NULL, NULL, 1, 0),
('Thor: The Dark World', 'movie', 2013, 'The Infinity Saga', 'Phase 2', NULL, 'The Reality Stone surfaces — an Infinity Stone with multiversal implications.', 8, 0, 0, 0, NULL, NULL, 1, 0),
('Captain America: The Winter Soldier', 'movie', 2014, 'The Infinity Saga', 'Phase 2', NULL, 'HYDRA infiltrates SHIELD — trust shattered, alliances tested.', 9, 0, 0, 0, NULL, NULL, 1, 0),
('Guardians of the Galaxy', 'movie', 2014, 'The Infinity Saga', 'Phase 2', NULL, 'A ragtag cosmic team and the Power Stone enter the MCU.', 10, 0, 0, 0, NULL, NULL, 1, 0),
('Avengers: Age of Ultron', 'movie', 2015, 'The Infinity Saga', 'Phase 2', NULL, 'Ultron rises, Vision is born, and the seeds of Civil War are planted.', 11, 0, 0, 0, NULL, NULL, 1, 0),
('Ant-Man', 'movie', 2015, 'The Infinity Saga', 'Phase 2', NULL, 'Scott Lang discovers the Quantum Realm — key to time travel later.', 12, 0, 0, 0, NULL, NULL, 1, 0);

-- Phase 3
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('Captain America: Civil War', 'movie', 2016, 'The Infinity Saga', 'Phase 3', NULL, 'The Avengers fracture over the Sokovia Accords — heroes vs. heroes.', 13, 0, 1, 0, NULL, NULL, 1, 0),
('Doctor Strange', 'movie', 2016, 'The Infinity Saga', 'Phase 3', NULL, 'Stephen Strange masters the mystic arts and the Time Stone.', 14, 0, 0, 0, NULL, NULL, 1, 0),
('Guardians of the Galaxy Vol. 2', 'movie', 2017, 'The Infinity Saga', 'Phase 3', NULL, 'Peter Quill discovers his Celestial heritage.', 15, 0, 0, 0, NULL, NULL, 1, 0),
('Spider-Man: Homecoming', 'movie', 2017, 'The Infinity Saga', 'Phase 3', NULL, 'Peter Parker''s MCU debut as he balances high school and heroics.', 16, 0, 1, 0, NULL, NULL, 1, 0),
('Thor: Ragnarok', 'movie', 2017, 'The Infinity Saga', 'Phase 3', NULL, 'Asgard falls, Hela rises, and Thor finds his true power.', 17, 0, 0, 0, NULL, NULL, 1, 0),
('The Punisher', 'series', 2017, 'The Infinity Saga', 'Phase 3', NULL, 'Frank Castle enacts brutal justice in New York.', 18, 0, 1, 0, NULL, NULL, 1, 0),
('Black Panther', 'movie', 2018, 'The Infinity Saga', 'Phase 3', NULL, 'T''Challa claims the throne of Wakanda and its vibranium legacy.', 19, 0, 0, 0, NULL, NULL, 1, 0),
('Avengers: Infinity War', 'movie', 2018, 'The Infinity Saga', 'Phase 3', NULL, 'Thanos collects all six Infinity Stones — half the universe turns to dust.', 20, 0, 0, 0, NULL, NULL, 1, 0),
('Ant-Man and the Wasp', 'movie', 2018, 'The Infinity Saga', 'Phase 3', NULL, 'A deeper dive into the Quantum Realm.', 21, 0, 0, 0, NULL, NULL, 1, 0),
('Captain Marvel', 'movie', 2019, 'The Infinity Saga', 'Phase 3', NULL, 'Carol Danvers gains cosmic powers — one of the universe''s strongest heroes.', 22, 0, 0, 0, NULL, NULL, 1, 0),
('Avengers: Endgame', 'movie', 2019, 'The Infinity Saga', 'Phase 3', NULL, 'The time heist that fractured reality and set the stage for the multiverse saga.', 23, 1, 0, 0, NULL, NULL, 1, 0),
('Spider-Man: Far From Home', 'movie', 2019, 'The Infinity Saga', 'Phase 3', NULL, 'Post-Endgame world, Mysterio, and the multiverse tease.', 24, 0, 1, 0, NULL, NULL, 1, 0);

-- ==========================================
-- SAGA 2: THE MULTIVERSE SAGA
-- ==========================================

-- Phase 4
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('WandaVision', 'series', 2021, 'The Multiverse Saga', 'Phase 4', NULL, 'Wanda''s reality-warping grief — the emotional core of the Secret Wars saga.', 25, 1, 0, 0, NULL, NULL, 1, 0),
('Loki Season 1', 'series', 2021, 'The Multiverse Saga', 'Phase 4', NULL, 'The TVA, the Sacred Timeline, and the multiverse''s true nature revealed.', 26, 1, 0, 0, NULL, NULL, 1, 0),
('Black Widow', 'movie', 2021, 'The Multiverse Saga', 'Phase 4', NULL, 'Natasha''s past catches up — the Red Room and its legacy.', 27, 0, 0, 0, NULL, NULL, 1, 0),
('What If...? Season 1', 'series', 2021, 'The Multiverse Saga', 'Phase 4', NULL, 'Alternate realities that preview the chaos of multiversal convergence.', 28, 0, 0, 0, NULL, NULL, 1, 0),
('Shang-Chi and the Legend of the Ten Rings', 'movie', 2021, 'The Multiverse Saga', 'Phase 4', NULL, 'Shang-Chi wields ancient power as the real Mandarin is revealed.', 29, 0, 0, 0, NULL, NULL, 1, 0),
('Eternals', 'movie', 2021, 'The Multiverse Saga', 'Phase 4', NULL, 'Ancient cosmic beings and the Celestials'' grand design for Earth.', 30, 0, 0, 0, NULL, NULL, 1, 0),
('Hawkeye', 'series', 2021, 'The Multiverse Saga', 'Phase 4', NULL, 'Clint Barton and Kate Bishop take on the criminal underworld.', 31, 0, 0, 0, NULL, NULL, 1, 0),
('Spider-Man: No Way Home', 'movie', 2021, 'The Multiverse Saga', 'Phase 4', NULL, 'The multiverse cracks open — villains and heroes from other universes arrive.', 32, 1, 1, 0, NULL, NULL, 1, 0),
('Moon Knight', 'series', 2022, 'The Multiverse Saga', 'Phase 4', NULL, 'Marc Spector and Steven Grant navigate Egyptian mythology.', 33, 0, 0, 0, NULL, NULL, 1, 0),
('Doctor Strange in the Multiverse of Madness', 'movie', 2022, 'The Multiverse Saga', 'Phase 4', NULL, 'Strange explores the multiverse and encounters incursions firsthand.', 34, 1, 0, 0, NULL, NULL, 1, 0),
('Ms. Marvel', 'series', 2022, 'The Multiverse Saga', 'Phase 4', NULL, 'Kamala Khan discovers her powers and her heritage.', 35, 0, 0, 0, NULL, NULL, 1, 0),
('Thor: Love and Thunder', 'movie', 2022, 'The Multiverse Saga', 'Phase 4', NULL, 'Thor faces Gorr the God Butcher and reunites with Jane Foster.', 36, 0, 0, 0, NULL, NULL, 1, 0),
('She-Hulk', 'series', 2022, 'The Multiverse Saga', 'Phase 4', NULL, 'Jennifer Walters gains Hulk powers and navigates superhero law.', 37, 0, 1, 0, NULL, 'Watch eps 1 & 9', 1, 0),
('Black Panther: Wakanda Forever', 'movie', 2022, 'The Multiverse Saga', 'Phase 4', NULL, 'Wakanda''s new era and vibranium technology play into the multiversal war.', 38, 1, 0, 0, NULL, NULL, 1, 0);

-- Phase 5
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('Ant-Man and the Wasp: Quantumania', 'movie', 2023, 'The Multiverse Saga', 'Phase 5', NULL, 'The Quantum Realm, Kang, and the multiverse''s first major battleground.', 39, 1, 0, 0, NULL, NULL, 1, 0),
('Guardians of the Galaxy Vol. 3', 'movie', 2023, 'The Multiverse Saga', 'Phase 5', NULL, 'The Guardians'' final mission — Rocket''s origin and the team''s farewell.', 40, 0, 0, 0, NULL, NULL, 1, 0),
('Secret Invasion', 'series', 2023, 'The Multiverse Saga', 'Phase 5', NULL, 'Nick Fury uncovers a Skrull conspiracy on Earth.', 41, 0, 0, 0, NULL, NULL, 1, 0),
('Loki Season 2', 'series', 2023, 'The Multiverse Saga', 'Phase 5', NULL, 'Loki becomes the god of the multiverse — the lynchpin of everything to come.', 42, 1, 0, 0, NULL, NULL, 1, 0),
('The Marvels', 'movie', 2023, 'The Multiverse Saga', 'Phase 5', NULL, 'Carol, Monica, and Kamala team up across dimensions.', 43, 0, 0, 0, NULL, NULL, 1, 0),
('What If...? Season 2', 'series', 2023, 'The Multiverse Saga', 'Phase 5', NULL, 'More alternate realities exploring the multiverse.', 44, 1, 0, 0, NULL, NULL, 1, 0),
('Echo', 'series', 2024, 'The Multiverse Saga', 'Phase 5', NULL, 'Maya Lopez faces her past and Kingpin.', 45, 0, 0, 0, NULL, NULL, 1, 0),
('Deadpool & Wolverine', 'movie', 2024, 'The Multiverse Saga', 'Phase 5', NULL, 'Deadpool joins the MCU timeline with Wolverine in tow.', 46, 1, 0, 1, NULL, NULL, 1, 0),
('Agatha All Along', 'series', 2024, 'The Multiverse Saga', 'Phase 5', NULL, 'Agatha Harkness breaks free and walks the Witches'' Road.', 47, 0, 0, 0, NULL, NULL, 1, 0),
('Captain America: Brave New World', 'movie', 2025, 'The Multiverse Saga', 'Phase 5', NULL, 'Sam Wilson takes up the mantle of Captain America officially.', 48, 0, 0, 0, NULL, NULL, 1, 0),
('Daredevil: Born Again', 'series', 2025, 'The Multiverse Saga', 'Phase 5', NULL, 'Matt Murdock returns to the MCU — street-level heroics meet the bigger picture.', 49, 0, 1, 0, NULL, NULL, 1, 0),
('Thunderbolts*', 'movie', 2025, 'The Multiverse Saga', 'Phase 5', NULL, 'Marvel''s anti-hero squad assembles with direct ties to the Doomsday event.', 50, 1, 0, 0, NULL, NULL, 1, 0);

-- Phase 6
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('The Fantastic Four: First Steps', 'movie', 2025, 'The Multiverse Saga', 'Phase 6', NULL, 'The MCU''s First Family arrives — key players in the multiverse conflict ahead.', 51, 1, 0, 0, NULL, NULL, 1, 0),
('VisionQuest', 'series', 2026, 'The Multiverse Saga', 'Phase 6', NULL, 'White Vision''s search for identity ties directly into the Doomsday conflict.', 52, 1, 0, 0, NULL, NULL, 1, 0),
('Spider-Man: Brand New Day', 'movie', 2026, 'The Multiverse Saga', 'Phase 6', NULL, 'Peter Parker returns with a fresh start that leads straight into the crossover.', 53, 1, 1, 0, NULL, NULL, 1, 0),
('Avengers: Doomsday', 'movie', 2026, 'The Multiverse Saga', 'Phase 6', NULL, 'Doctor Doom arrives. The Avengers face their greatest threat yet.', 54, 1, 0, 0, NULL, NULL, 1, 0),
('Avengers: Secret Wars', 'movie', 2027, 'The Multiverse Saga', 'Phase 6', NULL, 'The culmination of the Multiverse Saga — everything leads here.', 55, 1, 0, 0, NULL, NULL, 1, 0);

-- ==========================================
-- LEGACY STUDIOS (NON-MCU)
-- ==========================================

-- Legacy Spider-Man (Non-MCU)
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('Spider-Man', 'movie', 2002, 'Legacy Studios (Non-MCU)', NULL, 'Legacy Spider-Man (Non-MCU)', 'Tobey Maguire''s debut as the web-slinger.', 56, 0, 0, 0, NULL, NULL, 1, 0),
('Spider-Man 2', 'movie', 2004, 'Legacy Studios (Non-MCU)', NULL, 'Legacy Spider-Man (Non-MCU)', 'Peter Parker battles Doc Ock and his own inner demons.', 57, 0, 0, 0, NULL, NULL, 1, 0),
('Spider-Man 3', 'movie', 2007, 'Legacy Studios (Non-MCU)', NULL, 'Legacy Spider-Man (Non-MCU)', 'The symbiote arrives in Raimi''s universe.', 58, 0, 0, 0, NULL, NULL, 1, 0),
('The Amazing Spider-Man', 'movie', 2012, 'Legacy Studios (Non-MCU)', NULL, 'Legacy Spider-Man (Non-MCU)', 'Andrew Garfield''s debut as the web-slinger.', 59, 0, 0, 0, NULL, NULL, 1, 0),
('The Amazing Spider-Man 2', 'movie', 2014, 'Legacy Studios (Non-MCU)', NULL, 'Legacy Spider-Man (Non-MCU)', 'Electro and the Green Goblin clash with Spider-Man.', 60, 0, 0, 0, NULL, NULL, 1, 0);

-- Spider-Verse (Animated)
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('Spider-Man: Into the Spider-Verse', 'movie', 2018, 'Legacy Studios (Non-MCU)', NULL, 'Spider-Verse (Animated)', 'Miles Morales discovers the multiverse.', 61, 0, 0, 0, NULL, NULL, 1, 0),
('Spider-Man: Across the Spider-Verse', 'movie', 2023, 'Legacy Studios (Non-MCU)', NULL, 'Spider-Verse (Animated)', 'Miles travels deeper into the Spider-Verse.', 62, 0, 0, 0, NULL, NULL, 1, 0),
('Spider-Man: Beyond the Spider-Verse', 'movie', 2025, 'Legacy Studios (Non-MCU)', NULL, 'Spider-Verse (Animated)', 'The conclusion to Miles Morales'' multiversal journey.', 63, 0, 0, 0, NULL, NULL, 0, 0);

-- Sony Villains Universe
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('Venom', 'movie', 2018, 'Legacy Studios (Non-MCU)', NULL, 'Sony Villains Universe', 'Sony — not MCU canon, shared multiverse ties via No Way Home.', 64, 0, 0, 0, NULL, NULL, 1, 0),
('Venom: Let There Be Carnage', 'movie', 2021, 'Legacy Studios (Non-MCU)', NULL, 'Sony Villains Universe', 'Sony — not MCU canon, shared multiverse ties via No Way Home.', 65, 0, 0, 0, NULL, NULL, 1, 0),
('Morbius', 'movie', 2022, 'Legacy Studios (Non-MCU)', NULL, 'Sony Villains Universe', 'Sony — not MCU canon, shared multiverse ties via No Way Home.', 66, 0, 0, 0, NULL, NULL, 1, 0),
('Madame Web', 'movie', 2024, 'Legacy Studios (Non-MCU)', NULL, 'Sony Villains Universe', 'Sony — not MCU canon, shared multiverse ties via No Way Home.', 67, 0, 0, 0, NULL, NULL, 1, 0),
('Venom: The Last Dance', 'movie', 2024, 'Legacy Studios (Non-MCU)', NULL, 'Sony Villains Universe', 'Sony — not MCU canon, shared multiverse ties via No Way Home.', 68, 0, 0, 0, NULL, NULL, 1, 0),
('Kraven the Hunter', 'movie', 2024, 'Legacy Studios (Non-MCU)', NULL, 'Sony Villains Universe', 'Sony — not MCU canon, shared multiverse ties via No Way Home.', 69, 0, 0, 0, NULL, NULL, 1, 0);

-- Deadpool (Fox Legacy)
INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('Deadpool', 'movie', 2016, 'Legacy Studios (Non-MCU)', NULL, 'Deadpool (Fox Legacy)', 'Wade Wilson''s foul-mouthed origin story.', 70, 0, 0, 1, NULL, NULL, 1, 0),
('Deadpool 2', 'movie', 2018, 'Legacy Studios (Non-MCU)', NULL, 'Deadpool (Fox Legacy)', 'Deadpool forms X-Force to protect a young mutant.', 71, 0, 0, 1, NULL, NULL, 1, 0),
('Once Upon a Deadpool', 'movie', 2018, 'Legacy Studios (Non-MCU)', NULL, 'Deadpool (Fox Legacy)', 'A PG-13 retelling of Deadpool 2 with new framing scenes.', 72, 0, 0, 0, NULL, 'Extended cut / optional', 1, 1);

-- ==========================================
-- X-MEN LEGACY
-- ==========================================

INSERT INTO titles (title, type, year, saga, phase, subgroup, blurb, sort_order, essential_doomsday, essential_brand_new_day, essential_deadpool_wolverine, badge_reason, episode_note, is_released, is_optional) VALUES
('X-Men', 'movie', 2000, 'X-Men Legacy', NULL, NULL, 'The original mutant team — their universe collides with the MCU in Secret Wars.', 73, 1, 0, 0, NULL, NULL, 1, 0),
('X2', 'movie', 2003, 'X-Men Legacy', NULL, NULL, 'The X-Men face greater threats, setting up the multiverse crossover potential.', 74, 1, 0, 0, NULL, NULL, 1, 0),
('X-Men: Days of Future Past', 'movie', 2014, 'X-Men Legacy', NULL, NULL, 'Time travel and alternate timelines — the blueprint for Secret Wars'' multiverse collision.', 75, 1, 0, 0, NULL, NULL, 1, 0),
('X-Men Origins: Wolverine', 'movie', 2009, 'X-Men Legacy', NULL, NULL, 'Logan''s early days and first encounter with Wade Wilson.', 76, 0, 0, 1, NULL, NULL, 1, 0),
('X-Men: First Class', 'movie', 2011, 'X-Men Legacy', NULL, NULL, 'The formation of the X-Men.', 77, 0, 0, 0, NULL, NULL, 1, 0),
('The Wolverine', 'movie', 2013, 'X-Men Legacy', NULL, NULL, 'Logan journeys to Japan.', 78, 0, 0, 1, NULL, NULL, 1, 0),
('X-Men: Apocalypse', 'movie', 2016, 'X-Men Legacy', NULL, NULL, 'The team battles an ancient mutant.', 79, 0, 0, 0, NULL, NULL, 1, 0),
('Logan', 'movie', 2017, 'X-Men Legacy', NULL, NULL, 'Wolverine''s final, brutal road trip.', 80, 0, 0, 1, NULL, NULL, 1, 0),
('X-Men: Dark Phoenix', 'movie', 2019, 'X-Men Legacy', NULL, NULL, 'Jean Grey embraces the Phoenix Force.', 81, 0, 0, 0, NULL, NULL, 1, 0);
