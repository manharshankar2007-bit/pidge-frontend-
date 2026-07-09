function resolveImageTokens(answer, images) {
    const used = [];

    const resolved = answer.replace(
        /\{\{image:([\w-]+)\}\}/g,
        (_, id) => {

            const image = images.find(i => i.id === id);

            if (!image) return "";

            used.push(image);

            return `[[IMAGE:${id}]]`;
        }
    );

    return {
        answer: resolved,
        images: [...new Map(used.map(i => [i.id, i])).values()]
    };
}

module.exports = resolveImageTokens;