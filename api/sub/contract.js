async function run(req, res) {
    await res.send('Contract is processing...\n');
} 

exports.run = run;