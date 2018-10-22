function rrToString(rr) {
    var parts = [rr.name, rr.ttl, rr.type, rr.class];
    switch(rr.type) {
    case 'DNSKEY':
        parts.push(rr.data.flags);
        parts.push(3);
        parts.push(rr.data.algorithm);
        parts.push(rr.data.key.toString('base64'));
        break;
    case 'RRSIG':
        parts.push(rr.data.typeCovered);
        parts.push(rr.data.algorithm);
        parts.push(rr.data.labels);
        parts.push(rr.data.originalTTL);
        parts.push(rr.data.expiration);
        parts.push(rr.data.inception);
        parts.push(rr.data.keyTag);
        parts.push(rr.data.signersName);
        parts.push(rr.data.signature.toString('base64'));
        break;
    case 'DS':
        parts.push(rr.data.keyTag);
        parts.push(rr.data.algorithm);
        parts.push(rr.data.digestType);
        parts.push(rr.data.digest.toString('base64'));
        break;
    case 'TXT':
        var dec = new TextDecoder("utf-8")
        parts.push(rr.data.map(s => '"' + dec.decode(s) + '"').join(" "));
        break;
    default:
        parts.push(JSON.stringify(rr.data));
        break;
    }
    return parts.join("\t");
}

export default rrToString
