function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samplesArray.filter(samp => samp.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.map(id => `OTU ${id}`).slice(0, 10).reverse();

    // 8. Create the trace for the bar chart. 
    var trace = [{
      x: sampleValues.slice(0, 10).reverse(),
      //try with and without 'slice' method
      y: yticks, 
      //try text with and without 'slice' method
      text: otuLabels.slice(0,10).reverse(),
      orientation: 'h',
      type: "bar",
    }];

    // DELIVERABLE 1
    // Bar chart
    var data = [trace];

    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Concentration" },
      yaxis: { title: "Bacteria Name" }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", data, layout);

// DELIVERABLE 2
// Bubble chart
// Create the buildCharts function.

    // 1. Create the trace for the bubble chart.
    var trace2 = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Cividis'
      }
    }];
    var data2 = [trace2];
    
    // 2. Create the layout for the bubble chart.
    var layout2 = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: "OTU id" },
      yaxis: { title: "Quantity" },
      hovermode: 'closest',
      showlegend: false,
      height: 600,
      width: 600
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', data2, layout2); 

    // DELIVERABLE 3
    // Gauge chart
    // 3. Create a variable that holds the washing frequency.    
    var washingFrequency = resultArray[0];
    console.log(washingFrequency)

    // 4. Create the trace for the gauge chart.
    var trace3 = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: 270,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      value: washingFrequency,
      gauge: {
        axis: { range: [null, 500] },
        steps: [
          { range: [0, 250], color: "lightgray" },
          { range: [250, 400], color: "gray" }
        ],
        threshold: {
          line: { color: "red", width: 3 },
          thickness: 1.0,
          value: 500
        }
      }
    }];
    var data3 = trace3;

    // 5. Create the layout for the gauge chart.
    var layout3 = { 
      width: 600, height: 450, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', data3, layout3);
  });
}