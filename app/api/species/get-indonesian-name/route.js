export const runtime = "nodejs"; // Server-side only

export async function POST(request) {
  try {
    const { scientificName } = await request.json();

    if (!scientificName) {
      return Response.json(
        { error: "scientificName is required" },
        { status: 400 }
      );
    }

    // Search di Wikidata untuk entity dengan nama ilmiah
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
      scientificName,
    )}&language=id&type=item&format=json`;

    const searchResponse = await fetch(searchUrl, {
      headers: { "User-Agent": "FicPactCup/1.0" },
      timeout: 5000,
    });

    if (!searchResponse.ok) {
      return Response.json(
        { indonesianName: scientificName, description: "" },
        { status: 200 }
      );
    }

    const data = await searchResponse.json();

    if (data.search && data.search.length > 0) {
      const entityId = data.search[0].id;

      // Get label & description dalam bahasa Indonesia
      const detailUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=labels|descriptions&languages=id|en&format=json`;
      const detailResponse = await fetch(detailUrl, {
        headers: { "User-Agent": "FicPactCup/1.0" },
        timeout: 5000,
      });

      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        const entity = detailData.entities[entityId];

        // Prioritas: Indonesian label > English label > scientific name
        const label =
          entity.labels?.id?.value ||
          entity.labels?.en?.value ||
          scientificName;
        const description =
          entity.descriptions?.id?.value ||
          entity.descriptions?.en?.value ||
          "";

        return Response.json(
          { indonesianName: label, description },
          { status: 200 }
        );
      }
    }

    return Response.json(
      { indonesianName: scientificName, description: "" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error.message);
    // Return graceful fallback
    return Response.json(
      { indonesianName: "Species", description: "", error: error.message },
      { status: 200 }
    );
  }
}
