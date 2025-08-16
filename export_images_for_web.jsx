// Pick specific PSD files (multi-select)
var inputFiles = File.openDialog(
    "Select one or more PSD files", 
    "Photoshop files:*.psd;*.psb", 
    true // <- allow multi-select
);

// Still pick an output folder
var outputFolder = Folder.selectDialog("Select the output folder for JPEGs");

// Bail if user cancels
if (!inputFiles || !outputFolder) {
    // user cancelled
} else {
    // If only one file was selected, File.openDialog returns a File (not an Array)
    if (!(inputFiles instanceof Array)) inputFiles = [inputFiles];

    var targetGroupName = "aretes_editados"; // Name of the group/layer to rotate
    var rotateAngle = 15; // Angle to rotate

    for (var i = 0; i < inputFiles.length; i++) {
        var doc = open(inputFiles[i]);
        try {
            // Prepare output filenames
            var fileName = doc.name.replace(/\.[^\.]+$/, ''); // remove extension
            var outFile1 = new File(outputFolder + "/" + fileName + "-01.jpg");
            var outFile2 = new File(outputFolder + "/" + fileName + "-02.jpg");

            // Save File1 (normal position) - Save for Web
            var opts = new ExportOptionsSaveForWeb();
            opts.format = SaveDocumentType.JPEG;
            opts.optimized = true;
            opts.quality = 100;
            opts.includeProfile = false;

            doc.exportDocument(outFile1, ExportType.SAVEFORWEB, opts);

            // Find target group first; if not, try a layer
            var target;
            try {
                target = doc.layerSets.getByName(targetGroupName);
            } catch (e) {
                try {
                    target = doc.artLayers.getByName(targetGroupName);
                } catch (e2) {
                    alert("Group or layer '" + targetGroupName + "' not found in " + doc.name);
                    continue; // skip this doc
                }
            }

            // Rotate and export second image
            doc.activeLayer = target;
            target.rotate(rotateAngle, AnchorPosition.MIDDLECENTER);
            doc.exportDocument(outFile2, ExportType.SAVEFORWEB, opts);

        } finally {
            // Close without saving changes
            doc.close(SaveOptions.DONOTSAVECHANGES);
        }
    }
}
