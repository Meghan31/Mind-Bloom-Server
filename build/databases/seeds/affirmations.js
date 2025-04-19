/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('affirmations').del();

	// Insert seed data with specific mood types matching frontend moods
	await knex('affirmations').insert([
		// Happy mood affirmations
		{
			content: 'Your positive energy is contagious. Keep shining your light!',
			mood_type: 'Happy',
		},
		{
			content: 'Your joy is a gift to the world. Celebrate your happiness!',
			mood_type: 'Happy',
		},
		{
			content:
				"Today's happiness builds tomorrow's foundation. Enjoy every moment!",
			mood_type: 'Happy',
		},

		// Relaxed mood affirmations
		{
			content: 'The calm you feel now is a reflection of your inner peace.',
			mood_type: 'Relaxed',
		},
		{
			content: 'In this relaxed state, you can see possibilities more clearly.',
			mood_type: 'Relaxed',
		},
		{
			content: 'Your ability to find relaxation is a powerful strength.',
			mood_type: 'Relaxed',
		},

		// Confident mood affirmations
		{
			content: 'Your confidence inspires others to believe in themselves.',
			mood_type: 'Confident',
		},
		{
			content: 'With confidence comes the power to create positive change.',
			mood_type: 'Confident',
		},
		{
			content: 'Your self-assurance is well-earned and deserved.',
			mood_type: 'Confident',
		},

		// Calm mood affirmations
		{ content: 'In calmness lies clarity and wisdom.', mood_type: 'Calm' },
		{
			content: 'Your calm presence has a positive impact on those around you.',
			mood_type: 'Calm',
		},
		{
			content: 'This moment of calm is a gift you have given yourself.',
			mood_type: 'Calm',
		},

		// Content mood affirmations
		{
			content: "Contentment is one of life's greatest treasures.",
			mood_type: 'Content',
		},
		{
			content: 'Being content with what you have is true wealth.',
			mood_type: 'Content',
		},
		{
			content:
				'Your contentment reflects your wisdom about what truly matters.',
			mood_type: 'Content',
		},

		// Reflective mood affirmations
		{
			content: 'Your reflections today create clarity for tomorrow.',
			mood_type: 'Reflective',
		},
		{
			content: 'In reflection, we find the lessons that help us grow.',
			mood_type: 'Reflective',
		},
		{
			content: 'Your thoughtfulness is a sign of a rich inner life.',
			mood_type: 'Reflective',
		},

		// Sad mood affirmations
		{
			content:
				"It's okay not to be okay. Your feelings are valid and temporary.",
			mood_type: 'Sad',
		},
		{
			content: 'Every storm runs out of rain. This difficult time will pass.',
			mood_type: 'Sad',
		},
		{
			content: 'You are stronger than you think. You will get through this.',
			mood_type: 'Sad',
		},

		// Anxious mood affirmations
		{
			content:
				'One breath at a time. You have overcome anxious moments before.',
			mood_type: 'Anxious',
		},
		{
			content:
				"Your anxiety doesn't define you. It's just one part of your rich, complex self.",
			mood_type: 'Anxious',
		},
		{
			content: 'You have the tools and strength to move through this anxiety.',
			mood_type: 'Anxious',
		},

		// Frustrated mood affirmations
		{
			content:
				'Frustration is often a sign that you care deeply about something important.',
			mood_type: 'Frustrated',
		},
		{
			content: 'This frustration will pass, leaving you with new insights.',
			mood_type: 'Frustrated',
		},
		{
			content: 'Every frustration carries the seed of a new understanding.',
			mood_type: 'Frustrated',
		},

		// Bittersweet mood affirmations
		{
			content:
				'The bitter and sweet parts of life both contribute to your growth.',
			mood_type: 'Bittersweet',
		},
		{
			content: 'Embracing both joy and sadness is a sign of emotional wisdom.',
			mood_type: 'Bittersweet',
		},
		{
			content:
				"These mixed feelings are a reminder of life's beautiful complexity.",
			mood_type: 'Bittersweet',
		},

		// Nostalgic mood affirmations
		{
			content: 'Your memories are treasures that no one can take away.',
			mood_type: 'Nostalgic',
		},
		{
			content: 'Nostalgia connects us to our past while we create our future.',
			mood_type: 'Nostalgic',
		},
		{
			content:
				"The past has shaped you, but it doesn't limit who you can become.",
			mood_type: 'Nostalgic',
		},

		// Conflicted mood affirmations
		{
			content: 'Inner conflict often precedes personal growth and clarity.',
			mood_type: 'Conflicted',
		},
		{
			content:
				"It's okay to hold conflicting thoughts. It means you see the complexity in life.",
			mood_type: 'Conflicted',
		},
		{
			content:
				'This internal struggle will lead to a more authentic path forward.',
			mood_type: 'Conflicted',
		},
	]);
};
