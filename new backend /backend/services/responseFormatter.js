function formatResponse(answer, feature) {
  if (!feature) {
    return {
      sections: [
        {
          title: "Answer",
          text: answer,
          images: []
        }
      ]
    };
  }

  const sections = [];

  // Overview
  sections.push({
    title: "Overview",
    text:
      feature.summary ||
      feature.purpose ||
      answer,
    images: feature.images
      ? feature.images.slice(0, 1)
      : []
  });

  // Benefits
  if (feature.benefits?.length) {
    sections.push({
      title: "Benefits",
      text: feature.benefits
        .map(x => "• " + x)
        .join("\n"),
      images:
        feature.images?.slice(1, 2) || []
    });
  }

  // How to Use
  if (feature.how_to_use?.length) {
    sections.push({
      title: "How it Works",
      text: feature.how_to_use
        .map(x => "• " + x)
        .join("\n"),
      images:
        feature.images?.slice(2, 3) || []
    });
  }

  // Navigation
  if (feature.navigation?.length) {
    sections.push({
      title: "Navigation",
      text: feature.navigation.join("\n"),
      images: []
    });
  }

  // Related Features
  if (feature.related?.length) {
    sections.push({
      title: "Related Features",
      text: feature.related
        .map(x => "• " + x)
        .join("\n"),
      images: []
    });
  }

  return {
    sections
  };
}

module.exports = formatResponse;