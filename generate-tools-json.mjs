// generate-tools-json.mjs

// Part 1: Getting our tools from the toolbox.
// 'fs' lets us read and write files. 'path' helps us deal with file paths like C:\folder\file.txt or /home/user/file.
import fs from 'fs';
import path from 'path';

// Part 2: Setting up our workspace.
// We tell the script where to find the folder with all your tool files.
const toolsDirectory = path.join(process.cwd(), 'tools');
// And we tell it where to save the final list.
const outputFilePath = path.join(process.cwd(), 'tools.json');

console.log('Starting to build the tool list...');

// Part 3: The main work, wrapped in a safety net.
try {
    // Read all the filenames inside the '/tools/' directory.
    const filenames = fs.readdirSync(toolsDirectory);
    
    // From that list, we only want the files that end in '.html'.
    const htmlFiles = filenames.filter(file => file.endsWith('.html'));
    
    console.log(`Found ${htmlFiles.length} HTML tool files.`);

    // Go through each HTML filename, one by one, and turn it into a structured piece of data.
    const toolsData = htmlFiles.map(filename => {
        const filePath = path.join(toolsDirectory, filename);
        
        // To be fast, we only read the first 5 lines of each HTML file to find its category.
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const firstLines = fileContent.split('\n').slice(0, 5).join('\n');
        
        // We look for a special comment like <!-- Category: Health -->
        const categoryMatch = firstLines.match(/<!--\s*Category:\s*([^>]+?)\s*-->/);
        // If we find a category in the comment, we use it. If not, we'll just call it 'Utility'.
        const category = categoryMatch ? categoryMatch[1].trim() : 'Utility'; 

        // Now, we create the tool's ID and Name directly from its filename.
        // For example, "App-Usage-Monitor.html" becomes:
        const id = filename.replace('.html', '');             // id: "App-Usage-Monitor"
        const name = id.replace(/-/g, ' ');                   // Name: "App Usage Monitor"

        // We return a neat object with all the details for this one tool.
        return {
            id: id,
            Name: name,
            Category: category
        };
    });

    // To keep the list tidy, we sort all the tools alphabetically by their name.
    toolsData.sort((a, b) => a.Name.localeCompare(b.Name));

    // Finally, we take our complete, sorted list and write it into the 'tools.json' file.
    // The 'null, 2' part just makes the file nicely formatted and easy for a human to read.
    fs.writeFileSync(outputFilePath, JSON.stringify(toolsData, null, 2));
    
    console.log(`Success! The 'tools.json' file was created with ${toolsData.length} tools.`);

} catch (error) {
    // This is our safety net. If anything goes wrong, this code will run.
    console.error('An error happened while creating the tool list:', error);
    process.exit(1); // This stops the deployment to prevent a broken site from going live.
}