"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Delete existing affirmations first to avoid duplicates
    await prisma.affirmation.deleteMany({});
    // Seed affirmations
    const affirmations = [
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
            content: "Today's happiness builds tomorrow's foundation. Enjoy every moment!",
            mood_type: 'Happy',
        },
        // Happy mood affirmations (additional)
        {
            content: "Happiness is not a destination — it's a way of life.",
            mood_type: 'Happy',
        },
        {
            content: 'Your joy lights up the lives of those around you.',
            mood_type: 'Happy',
        },
        {
            content: "The world is brighter because you're in it.",
            mood_type: 'Happy',
        },
        {
            content: 'You deserve every bit of the happiness you feel today.',
            mood_type: 'Happy',
        },
        {
            content: 'Let your smile be your superpower.',
            mood_type: 'Happy',
        },
        {
            content: 'The more you celebrate life, the more there is to celebrate.',
            mood_type: 'Happy',
        },
        {
            content: "Happiness grows when it's shared — keep spreading it!",
            mood_type: 'Happy',
        },
        {
            content: "You're glowing with positivity and it shows.",
            mood_type: 'Happy',
        },
        {
            content: 'Life loves to surprise you with joyful moments.',
            mood_type: 'Happy',
        },
        {
            content: "Being happy is a brave choice — you're doing great.",
            mood_type: 'Happy',
        },
        {
            content: 'You radiate good vibes and pure joy.',
            mood_type: 'Happy',
        },
        {
            content: 'Your laughter brings healing to others.',
            mood_type: 'Happy',
        },
        // Relaxed mood affirmations (additional)
        {
            content: 'Right now, peace flows through every breath you take.',
            mood_type: 'Relaxed',
        },
        {
            content: 'You are exactly where you need to be.',
            mood_type: 'Relaxed',
        },
        {
            content: 'Let tension melt away — this moment is yours to enjoy.',
            mood_type: 'Relaxed',
        },
        {
            content: 'You are safe, supported, and grounded.',
            mood_type: 'Relaxed',
        },
        {
            content: 'Your mind is at ease, your heart is light.',
            mood_type: 'Relaxed',
        },
        {
            content: "Stillness is strength — you're mastering it beautifully.",
            mood_type: 'Relaxed',
        },
        {
            content: 'Every exhale is a release of what no longer serves you.',
            mood_type: 'Relaxed',
        },
        {
            content: 'Your calm energy creates a sanctuary for others too.',
            mood_type: 'Relaxed',
        },
        {
            content: "It's okay to slow down — you're allowed to rest.",
            mood_type: 'Relaxed',
        },
        {
            content: 'You are aligned with serenity and flow.',
            mood_type: 'Relaxed',
        },
        {
            content: "You've earned this peace — savor it.",
            mood_type: 'Relaxed',
        },
        {
            content: "Even in quiet moments, you're making progress.",
            mood_type: 'Relaxed',
        },
        // Confident mood affirmations (additional)
        {
            content: 'You are capable of achieving anything you set your mind to.',
            mood_type: 'Confident',
        },
        {
            content: 'Your confidence opens doors to new opportunities.',
            mood_type: 'Confident',
        },
        {
            content: "You've already overcome so much — this is just the next step.",
            mood_type: 'Confident',
        },
        {
            content: 'Boldness is your nature — own it.',
            mood_type: 'Confident',
        },
        {
            content: 'Your voice deserves to be heard.',
            mood_type: 'Confident',
        },
        {
            content: 'You walk into every room like you belong — because you do.',
            mood_type: 'Confident',
        },
        {
            content: 'Every challenge you face, you do so with courage.',
            mood_type: 'Confident',
        },
        {
            content: 'You are worthy of success, love, and recognition.',
            mood_type: 'Confident',
        },
        {
            content: "You've got everything it takes — and more.",
            mood_type: 'Confident',
        },
        {
            content: 'You are your own greatest ally.',
            mood_type: 'Confident',
        },
        {
            content: "Confidence isn't arrogance — it's self-respect.",
            mood_type: 'Confident',
        },
        {
            content: 'Believe in your brilliance — the world already does.',
            mood_type: 'Confident',
        },
        // Calm mood affirmations (additional)
        {
            content: "Peace begins with a single breath — you're breathing it in now.",
            mood_type: 'Calm',
        },
        {
            content: 'You carry tranquility within you, no matter what surrounds you.',
            mood_type: 'Calm',
        },
        {
            content: 'Inhale peace, exhale worry.',
            mood_type: 'Calm',
        },
        {
            content: 'Calmness is your inner compass.',
            mood_type: 'Calm',
        },
        {
            content: 'You are grounded, steady, and serene.',
            mood_type: 'Calm',
        },
        {
            content: "The chaos around you can't shake your centered spirit.",
            mood_type: 'Calm',
        },
        {
            content: 'You are a beacon of calm in a noisy world.',
            mood_type: 'Calm',
        },
        {
            content: 'Inner peace is your true nature.',
            mood_type: 'Calm',
        },
        {
            content: 'You are rooted in the present moment.',
            mood_type: 'Calm',
        },
        {
            content: 'The quiet within you is powerful and wise.',
            mood_type: 'Calm',
        },
        {
            content: 'This stillness is helping you heal.',
            mood_type: 'Calm',
        },
        {
            content: "Calm isn't weakness — it's clarity.",
            mood_type: 'Calm',
        },
        // Content mood affirmations (additional)
        {
            content: 'Right now, you have everything you need.',
            mood_type: 'Content',
        },
        {
            content: "There is joy in simplicity, and you've found it.",
            mood_type: 'Content',
        },
        {
            content: "You're in tune with what truly matters.",
            mood_type: 'Content',
        },
        {
            content: 'Gratitude turns what you have into enough.',
            mood_type: 'Content',
        },
        {
            content: "You've made peace with where you are.",
            mood_type: 'Content',
        },
        {
            content: "Your heart feels full, and that's beautiful.",
            mood_type: 'Content',
        },
        {
            content: "You don't need more to be happy — just this moment.",
            mood_type: 'Content',
        },
        {
            content: "You're living your values, and it shows.",
            mood_type: 'Content',
        },
        {
            content: "You've built a life that brings you peace.",
            mood_type: 'Content',
        },
        {
            content: 'You are at home within yourself.',
            mood_type: 'Content',
        },
        {
            content: 'Your contentment is your compass.',
            mood_type: 'Content',
        },
        {
            content: 'The present moment is more than enough.',
            mood_type: 'Content',
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
            content: 'Your contentment reflects your wisdom about what truly matters.',
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
            content: "It's okay not to be okay. Your feelings are valid and temporary.",
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
            content: 'One breath at a time. You have overcome anxious moments before.',
            mood_type: 'Anxious',
        },
        {
            content: "Your anxiety doesn't define you. It's just one part of your rich, complex self.",
            mood_type: 'Anxious',
        },
        {
            content: 'You have the tools and strength to move through this anxiety.',
            mood_type: 'Anxious',
        },
        // Frustrated mood affirmations
        {
            content: 'Frustration is often a sign that you care deeply about something important.',
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
            content: 'The bitter and sweet parts of life both contribute to your growth.',
            mood_type: 'Bittersweet',
        },
        {
            content: 'Embracing both joy and sadness is a sign of emotional wisdom.',
            mood_type: 'Bittersweet',
        },
        {
            content: "These mixed feelings are a reminder of life's beautiful complexity.",
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
            content: "The past has shaped you, but it doesn't limit who you can become.",
            mood_type: 'Nostalgic',
        },
        // Conflicted mood affirmations
        {
            content: 'Inner conflict often precedes personal growth and clarity.',
            mood_type: 'Conflicted',
        },
        {
            content: "It's okay to hold conflicting thoughts. It means you see the complexity in life.",
            mood_type: 'Conflicted',
        },
        {
            content: 'This internal struggle will lead to a more authentic path forward.',
            mood_type: 'Conflicted',
        },
        // Reflective mood affirmations (additional)
        {
            content: 'You are growing through every experience, even the quiet ones.',
            mood_type: 'Reflective',
        },
        {
            content: 'Your self-awareness is a powerful guide.',
            mood_type: 'Reflective',
        },
        {
            content: 'You take the time to understand yourself — that is true wisdom.',
            mood_type: 'Reflective',
        },
        {
            content: 'Deep thinking leads to meaningful change.',
            mood_type: 'Reflective',
        },
        {
            content: 'Your reflections today are planting seeds for tomorrow.',
            mood_type: 'Reflective',
        },
        {
            content: 'You find strength in pausing and looking inward.',
            mood_type: 'Reflective',
        },
        {
            content: 'The more you learn about yourself, the more clarity you find.',
            mood_type: 'Reflective',
        },
        {
            content: 'Reflection is a form of love — for yourself and your journey.',
            mood_type: 'Reflective',
        },
        {
            content: 'Stillness allows your thoughts to unfold with grace.',
            mood_type: 'Reflective',
        },
        {
            content: "It's okay to not have all the answers yet.",
            mood_type: 'Reflective',
        },
        {
            content: 'You are crafting a story of depth and purpose.',
            mood_type: 'Reflective',
        },
        {
            content: 'Every moment of reflection shapes a better future.',
            mood_type: 'Reflective',
        },
        // Sad mood affirmations (additional)
        {
            content: 'You are allowed to feel this — emotions are human.',
            mood_type: 'Sad',
        },
        {
            content: 'Even through sadness, your light still shines.',
            mood_type: 'Sad',
        },
        {
            content: "Healing isn't linear, and that's okay.",
            mood_type: 'Sad',
        },
        {
            content: 'This feeling is part of your story, not the whole book.',
            mood_type: 'Sad',
        },
        {
            content: "You've felt low before and risen stronger each time.",
            mood_type: 'Sad',
        },
        {
            content: 'Gentle days are powerful too.',
            mood_type: 'Sad',
        },
        {
            content: "It's okay to rest, cry, and take space.",
            mood_type: 'Sad',
        },
        {
            content: "You are worthy of love, even when you're not feeling your best.",
            mood_type: 'Sad',
        },
        {
            content: "This pain won't last forever — it's moving through you.",
            mood_type: 'Sad',
        },
        {
            content: 'You are not alone in this moment.',
            mood_type: 'Sad',
        },
        {
            content: 'Your tears are a sign of your courage to feel.',
            mood_type: 'Sad',
        },
        {
            content: "You're holding on — and that's an act of strength.",
            mood_type: 'Sad',
        },
        // Anxious mood affirmations (additional)
        {
            content: 'You are not your thoughts — you are the calm observer.',
            mood_type: 'Anxious',
        },
        {
            content: "Right now, you're doing the best you can — and that's enough.",
            mood_type: 'Anxious',
        },
        {
            content: 'This moment is manageable — take it one step at a time.',
            mood_type: 'Anxious',
        },
        {
            content: 'Your breath is your anchor.',
            mood_type: 'Anxious',
        },
        {
            content: 'You are safe. You are supported. You are okay.',
            mood_type: 'Anxious',
        },
        {
            content: "You've gotten through this feeling before — you will again.",
            mood_type: 'Anxious',
        },
        {
            content: "You are allowed to take up space, even when you're anxious.",
            mood_type: 'Anxious',
        },
        {
            content: 'You are bigger than this wave of worry.',
            mood_type: 'Anxious',
        },
        {
            content: 'Let each breath bring you closer to peace.',
            mood_type: 'Anxious',
        },
        {
            content: "There's no rush — give yourself grace.",
            mood_type: 'Anxious',
        },
        {
            content: 'You are not broken — you are just overwhelmed.',
            mood_type: 'Anxious',
        },
        {
            content: "This moment will pass. You're doing just fine.",
            mood_type: 'Anxious',
        },
        // Frustrated mood affirmations (additional)
        {
            content: "You're allowed to feel frustrated — it means you care.",
            mood_type: 'Frustrated',
        },
        {
            content: "Progress doesn't always look perfect.",
            mood_type: 'Frustrated',
        },
        {
            content: "Take a breath — you don't need all the answers right now.",
            mood_type: 'Frustrated',
        },
        {
            content: "You're learning, even through the struggle.",
            mood_type: 'Frustrated',
        },
        {
            content: 'Frustration is a signal, not a setback.',
            mood_type: 'Frustrated',
        },
        {
            content: 'You have permission to pause and reset.',
            mood_type: 'Frustrated',
        },
        {
            content: 'This tension will lead to growth.',
            mood_type: 'Frustrated',
        },
        {
            content: "You're human — and that's more than okay.",
            mood_type: 'Frustrated',
        },
        {
            content: 'Challenges are shaping your resilience.',
            mood_type: 'Frustrated',
        },
        {
            content: "You don't need to solve everything today.",
            mood_type: 'Frustrated',
        },
        {
            content: "You are not stuck — you're just being redirected.",
            mood_type: 'Frustrated',
        },
        {
            content: 'Your patience is a quiet strength.',
            mood_type: 'Frustrated',
        },
        // Bittersweet mood affirmations (additional)
        {
            content: 'Life can be both tender and tough — and you are living both.',
            mood_type: 'Bittersweet',
        },
        {
            content: "There's beauty even in the ache.",
            mood_type: 'Bittersweet',
        },
        {
            content: 'You are allowed to feel grateful and sad at the same time.',
            mood_type: 'Bittersweet',
        },
        {
            content: "These feelings mean you've experienced something meaningful.",
            mood_type: 'Bittersweet',
        },
        {
            content: "You're not confused — you're just feeling deeply.",
            mood_type: 'Bittersweet',
        },
        {
            content: 'The contrast of emotions makes you more human.',
            mood_type: 'Bittersweet',
        },
        {
            content: 'You can hold both sorrow and celebration.',
            mood_type: 'Bittersweet',
        },
        {
            content: 'This moment holds layers — all of them matter.',
            mood_type: 'Bittersweet',
        },
        {
            content: "Duality is not conflict, it's complexity.",
            mood_type: 'Bittersweet',
        },
        {
            content: 'Bittersweet means you cared enough for it to hurt.',
            mood_type: 'Bittersweet',
        },
        {
            content: "You can smile with tears in your eyes — and that's strength.",
            mood_type: 'Bittersweet',
        },
        {
            content: 'You honor the past while stepping forward with grace.',
            mood_type: 'Bittersweet',
        },
        // Nostalgic mood affirmations (additional)
        {
            content: 'The past is a place of memories, not a place to stay.',
            mood_type: 'Nostalgic',
        },
        {
            content: 'Your story is full of moments worth revisiting.',
            mood_type: 'Nostalgic',
        },
        {
            content: "It's okay to miss a time that felt magical.",
            mood_type: 'Nostalgic',
        },
        {
            content: 'Nostalgia is a gentle reminder of love and connection.',
            mood_type: 'Nostalgic',
        },
        {
            content: 'Every memory carries a piece of your strength.',
            mood_type: 'Nostalgic',
        },
        {
            content: "Looking back doesn't mean you've lost your way.",
            mood_type: 'Nostalgic',
        },
        {
            content: "You're made of moments that still shine in your heart.",
            mood_type: 'Nostalgic',
        },
        {
            content: 'The past gave you roots — the present gives you wings.',
            mood_type: 'Nostalgic',
        },
        {
            content: "You can cherish what was and still welcome what's next.",
            mood_type: 'Nostalgic',
        },
        {
            content: "Memory is the soul's scrapbook — yours is beautiful.",
            mood_type: 'Nostalgic',
        },
        {
            content: 'You honor your journey by remembering it.',
            mood_type: 'Nostalgic',
        },
        {
            content: 'What you loved before helped shape who you are now.',
            mood_type: 'Nostalgic',
        },
        // Conflicted mood affirmations (additional)
        {
            content: "It's okay to not have it all figured out.",
            mood_type: 'Conflicted',
        },
        {
            content: 'Confusion is a sign that change is near.',
            mood_type: 'Conflicted',
        },
        {
            content: "You're in a space of transition — that's a powerful place to be.",
            mood_type: 'Conflicted',
        },
        {
            content: 'You can feel two things at once and still move forward.',
            mood_type: 'Conflicted',
        },
        {
            content: 'You are holding complexity with courage.',
            mood_type: 'Conflicted',
        },
        {
            content: "You're not lost — you're exploring.",
            mood_type: 'Conflicted',
        },
        {
            content: 'This discomfort is a path to clarity.',
            mood_type: 'Conflicted',
        },
        {
            content: 'You can trust yourself, even in uncertainty.',
            mood_type: 'Conflicted',
        },
        {
            content: "It's okay to take your time in choosing.",
            mood_type: 'Conflicted',
        },
        {
            content: "You don't need to rush a resolution.",
            mood_type: 'Conflicted',
        },
        {
            content: "The answers will come when you're ready to receive them.",
            mood_type: 'Conflicted',
        },
        {
            content: 'Conflict inside you means something new is forming.',
            mood_type: 'Conflicted',
        },
    ];
    // Insert all affirmations
    for (const affirmation of affirmations) {
        await prisma.affirmation.create({
            data: affirmation,
        });
    }
    console.log(`Seeded ${affirmations.length} affirmations`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
