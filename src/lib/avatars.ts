export const DEFAULT_AVATARS = [
    "🥳", "🎂", "🎉", "🎁", "🎇", "🌟", "✨", "🎈", "🎊", "🥂",
    "🧁", "🍬", "🍭", "🍩", "🍪", "🍕", "🍔", "🍿", "🏀", "⚽️",
    "🎨", "🎭", "🎮", "🏝️", "🚀", "🌈", "🔥", "💎", "🦾", "🦊"
];

export const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_AVATARS.length);
    return DEFAULT_AVATARS[randomIndex];
};

export const getAvatarUrl = (emoji: string) => {
    // We can use a service like ui-avatars.com to render an emoji as an image
    // or just render it directly in the UI if we change the <img> to a <div> for defaults.
    // For now, let's use a simple URL generator that renders text as an image.
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(emoji)}&background=random&color=fff&size=512&font-size=0.6`;
};
