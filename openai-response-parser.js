// Transform OpenAI Responses API output to the desired format with better error handling
const transformedJobs = [];

for (const item of $input.all()) {
  try {
    // Find the message output in the response
    const messageOutput = item.json.output?.find(output => output.type === "message");
    
    if (messageOutput && messageOutput.content && messageOutput.content.length > 0) {
      // Get the text content
      const textContent = messageOutput.content[0].text;
      
      // Try to extract JSON from the text (it's wrapped in ```json blocks)
      let jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/);
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          const jobData = JSON.parse(jsonMatch[1].trim());
          
          // Transform to the desired format
          transformedJobs.push({
            'Position Name': jobData.position_name || 'N/A',
            'Company Name': jobData.company_name || 'N/A',
            'Accessible Link': jobData.accessible_link || jobData.final_redirect_url || jobData.original_link || 'N/A',
            'Work Model': jobData.work_model || 'Unknown',
            'Job Location': jobData.job_location || 'Unknown'
          });
        } catch (jsonError) {
          console.log('JSON parsing error:', jsonError);
          console.log('Problematic JSON string:', jsonMatch[1]);
          transformedJobs.push({
            'Position Name': 'JSON Parse Error',
            'Company Name': 'JSON Parse Error',
            'Accessible Link': 'N/A',
            'Work Model': 'Unknown',
            'Job Location': 'Unknown'
          });
        }
      } else {
        // No JSON block found - check if it's just descriptive text
        console.log('No JSON block found in text:', textContent.substring(0, 200) + '...');
        transformedJobs.push({
          'Position Name': 'No JSON Found',
          'Company Name': 'No JSON Found',
          'Accessible Link': 'N/A',
          'Work Model': 'Unknown',
          'Job Location': 'Unknown'
        });
      }
    } else {
      // No message content found
      console.log('No message content found in item:', JSON.stringify(item.json, null, 2));
      transformedJobs.push({
        'Position Name': 'No Message Content',
        'Company Name': 'No Message Content',
        'Accessible Link': 'N/A',
        'Work Model': 'Unknown',
        'Job Location': 'Unknown'
      });
    }
  } catch (e) {
    console.log('General error parsing item:', e);
    console.log('Item structure:', JSON.stringify(item.json, null, 2));
    transformedJobs.push({
      'Position Name': 'Processing Error',
      'Company Name': 'Processing Error',
      'Accessible Link': 'N/A',
      'Work Model': 'Unknown',
      'Job Location': 'Unknown'
    });
  }
}

return transformedJobs;