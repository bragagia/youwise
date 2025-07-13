import { ResourceWithSections } from "@/types/resources";

export function getResourceStringForAI(
  resource: ResourceWithSections,
  focusSectionId?: string
): string {
  // Start with the resource name as the title
  let markdown = "";

  markdown += `Book name: ${resource.name}\n`;

  markdown += `Book description: \n`;
  markdown += `${resource.description}\n\n`;

  // Add each section as a subsection
  markdown += `What follow is the content of the book.\n`;
  if (focusSectionId) {
    markdown += `We are going to focus our work on a specific section, that section will be highlighted below\n`;
  }
  markdown += `\n\n`;

  resource.sections.forEach((section) => {
    const isFocused = focusSectionId && section.id === focusSectionId;

    markdown += `######### BEGINNING OF SECTION ${section.position} #########\n`;
    if (isFocused) {
      markdown += `# Title: **${section.title}** <- IMPORTANT: This is the section we are focusing on today!\n\n`;
    } else {
      markdown += `# Title: ${section.title}\n\n`;
    }

    markdown += `${section.content}\n\n`;

    if (section.more_content) {
      markdown += "### Section additional Content:\n";
      markdown += `${section.more_content}\n\n`;
    }

    if (isFocused) {
      markdown += `!!!!!!!!!!! END OF FOCUSED SECTION !!!!!!!!!!!\n\n`;
    }
  });

  return markdown;
}
