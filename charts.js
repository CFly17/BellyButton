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
      // Check if the key is 'wfreq' and change it to 'Washing Frequency'
      if(key === 'wfreq') {
        PANEL.append("h6").text(`Washing Frequency: ${value}`);
      } else {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
  }
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
    var filteredSamples = samplesArray.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // DELIVERABLE 1
    // Bar chart

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.map(id => `OTU ${id}`).slice(0, 10).reverse();

    // 8. Create the trace for the bar chart. 
    var traceBar = [{
      x: sampleValues.slice(0, 10).reverse(),
      //try with and without 'slice' method
      y: yticks,
      //try text with and without 'slice' method
      text: otuLabels.slice(0, 10).reverse(),
      orientation: 'h',
      type: "bar",
    }];

    // 9. Create the layout for the bar chart. 
    var layoutBar = {
      // paper_bgcolor: "bisque",
      // layoutpaper_bgcolor: "bisque",
      
      coloraxis: "black",
      font_family: "Gill Sans",
      paper_bgcolor: '#eee',
      title: {
        text: 'Top 10 Bacteria Cultures Found',
        font: {
          family: 'Gill Sans',
          size: 30
        }
      },
      xaxis: { title: "Concentration" },
      yaxis: {
        title: {
          text: "Bacteria ID",
          standoff: 10
        },
        title_standoff: 30, // Adjust this value as needed to increase the space
        tickfont: {
          size: 10 // Adjust this value to change the font size of the OTU IDs
        },
        automargin: true
      },
      margin: {
        l: 100, // Adjust the left margin to create more space
      }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", traceBar, layoutBar);

    // DELIVERABLE 2
    // Bubble chart
    // Create the buildCharts function.

    // 1. Create the trace for the bubble chart.
    var traceBubble = [{
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
    
    // 2. Create the layout for the bubble chart.
    var layoutBubble = {
      title: {
        text: "Bacteria Cultures per Sample",
        font: {
          family: 'Gill Sans',
          size: 30
        }
      },
      // plot_bgcolor: '#895',
      paper_bgcolor: '#eee',
      hovermode: 'closest',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: { title: "Bacteria ID" },
      yaxis: {
        title: "Concentration",
        title_standoff: 30, // Adjust this value as needed to increase the space
        tickfont: {
          size: 10 // Adjust this value to change the font size of the OTU IDs
        }
      },
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', traceBubble, layoutBubble);

    // DELIVERABLE 3
    // Gauge chart
    // 3. Create a variable that holds the washing frequency.    
    var metaWash = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var oneMeta = metaWash[0];
    var washingFrequency = oneMeta.wfreq;

    // 4. Create the trace for the gauge chart.
    var traceGauge = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: 270,
      title: {
        text: "Belly Button Washing Frequency",
        font: {
          family: 'Gill Sans',
          size: 30
        }
      },
      type: "indicator",
      mode: "gauge+number",
      value: washingFrequency,
      gauge: {
        bgcolor: "white",
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "#009a60" },
          { range: [2, 4], color: "#92b73a" },
          { range: [4, 6], color: "#edbd02" },
          { range: [6, 8], color: "#ff8c00" },
          { range: [8, 10], color: "red" },
        ],
        threshold: {
          line: { color: "red", width: 3 },
          thickness: 1.0,
          value: washingFrequency
        }
      }
    }];
    var dataGauge = traceGauge;

    // 5. Create the layout for the gauge chart.
    var layoutGauge = { 
      paper_bgcolor: '#eee',
      width: 600, height: 450, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', dataGauge, layoutGauge);
  });
}