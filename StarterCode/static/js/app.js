function init() {
    d3.json("samples.json").then((data) => {

        //Adding to the dropdown
        let selectBox = d3.select("#selDataset");

        data.names.forEach(name => {
            selectBox.append("option").attr("value", name).text(name)
        })


        //Display bar chart with top ten OTU's

        let values = data.samples[0].sample_values;
        let ids = data.samples[0].otu_ids;
        let hovertext = data.samples[0].otu_labels;

        let topValues = values.slice(0,10).reverse();
        let topLabels = ids.slice(0,10).reverse();
        let topHovertext = hovertext.slice(0,10).reverse();

        let trace1 = {
            y: topLabels.map(label => `OTU ${label}`),
            x: topValues,
            text: topHovertext,
            type: "bar",
            orientation: "h"

        };

        //Create Bar Chart

        let layout = {
            margin: {
                t: 20,
                b: 20
            }
        };

        let barChartData = [trace1]

        Plotly.newPlot("bar", barChartData, layout);

        // Create Bubble Chart

        let trace2 = {
            x: ids,
            y: values,
            text: hovertext,
            mode: "markers",

            
            marker: {
                size: values,
                color: ids,
            }
        }

        let bubbleData = [trace2];
        
        let layoutBubble = {
            xaxis: {title: "OTU ID"},
        }

        Plotly.newPlot("bubble", bubbleData, layoutBubble);

        let sampleData = d3.select("#sample-metadata");
        let Name = data.metadata[0];

        Object.entries(Name).forEach((key, value) => {
            sampleData.append("p").text(`${key}: ${value}`);
        })
    });
}


function optionChanged(selectValue) {
    d3.json("samples.json").then(data => {

        let samples = data.samples;
        let newChoice = samples.filter(sample => sample.id === selectValue);
        let values = newChoice[0].sample_values;
        let ids = newChoice[0].otu_ids;
        let hovertext = newChoice[0].otu_labels;

        let topValues = values.slice(0,10).reverse();
        let topLabels = ids.slice(0,10).reverse();
        let topHovertext = hovertext.slice(0,10).reverse();

        // Update Chart

        Plotly.restyle("bar", "y", [topLabels.map(label => `OTU ${label}`)]);
        Plotly.restyle("bar", "x", [topValues]);
        Plotly.restyle("bar", "text", [topHovertext]);

        // Update values 

        Plotly.restyle("bubble", "x", [ids]);
        Plotly.restyle("bubble", "y", [values]);
        Plotly.restyle("bubble", "size", [values]);
        Plotly.restyle("bubble", "text", [hovertext]);
        Plotly.restyle("bubble", "color", [ids]);

        let sampleData = d3.select("#sample-metadata");
        sampleData.html("");
 
        let metadata = data.metadata;
        let newData = metadata.filter(sample => sample.id == selectValue);

        Object.entries(newData[0]).forEach((key, value) => {
            sampleData.append("p").text(`${key}: ${value}`);
        })
    });
}
 
init();
