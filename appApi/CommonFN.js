exports.filterObjectInArray = function filterObjectInArray(arrinobj, saveEleminObj) {
    let returnVal = [];
    arrinobj.forEach((item, index, arr) => {
        if (item[saveEleminObj]) {
            returnVal.push(item[saveEleminObj]);
        } else {
            console.log("可能发生意外的错误");
        }
    });
    return returnVal;
}
exports.privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA1+KWfnOvOvMVHuiTV9bZa1ifkloXPG25aauUQdF4ljyBYyTg
xge3oI1EN3+WtoJxExrLgADw3VEhdDIsnQVW5mzV/ks80Tz26q4l7Ck+GynmSM8Z
c0LaSsVgul91qkDzSCcfXC97TLXM/9KPSsyw0fsXkFOW6Ui0+mIEBnn+TxJDWKqj
qKOqp+EGOCAS9xMkmUtSXTq4pvZGot0X5xVXGGRiPGTe1s7gQzn7hENccx64osKB
fF1pVvA4HXtffvRwcrpjF9dTbT4MWFJ5CTadyI8xaX87fjb2pS80jmJR5vWIhVqf
mwDbsLYmRV5sGwvTl9h5H9uv07WF5WRM9SoYywIDAQABAoIBAQC9bvuFfDd/77tR
wt0/z6w6sKpc/qazBMkUu1U9p/Q7SF50w/BkdHMh87OvS0rRXYahL/rvmGPCoCVN
05UoN344dboVCKoWJHu6FBP8tXfk2BBVRTzc0gXAZI/rGkainZmcb4/qEVQNTN3U
gUvxY8moh772ixK6I22C460KjdOkRxIvqKWJmdsDK8/bc4ut8I5J67tKa2/UHri+
J/A3trFAn6BMOtPkOs1KrXzQewBSXPxZtbIQXKukM8yuh5pNoQi7lw181shvIViW
Nrqa4RLtmb2c9LEXR+lcQRb1HYEksbEOTR4oa+4Dq4Cw7AzH82x73NBc171EU+ek
aGB5bxEBAoGBAPcsZTE+J1SHEidzENvfHhqlxL+6gEBKHGchfaGm9Mm3ZRkDtqDJ
GhU3MRuVBy1QrvcFMq9TGA1DbZ4mCEBR2qIuuy0926ReRyMYfLvjRJC4A9CLSv53
GDoeIh7kC2sMqNNAbirhceQMnAQBOBwgbspvJhVBe44aLhmxDpMJfK+BAoGBAN+Y
KWoE4mROddnM8iiow2XQIpaUQeIc+gKQAJv9EFAXhOSo4Qasy6nPGgm9bBI6e58F
8GMCFr8ibhkE59y0EFpx2YSegPE0pOL5ebhQxGaA+fFPumx5MpQ2e8ThdkMqU84a
3AJ0GEWD5GjyhEvtj3FpFFfDAaU2V9SVvIqq2a5LAoGAQAGcFrtcnfP4TITsibNm
bUod//RAv+UxI7e1e8XrP80g/fBLO6m3+mR3cAgQeriZBlivPl2LLewXF8wLePR5
ZGQrjlSlaxQK4di2fEUm/T7ZpghcHDck6+/fsBYnqsn1cfcOUEZfIsntINBcAlSX
vA46U2jIoQzAgWCrQIJFaoECgYAXYywZyc8AXPCYyoYd2KEvmhi0FWfaxdskv3lA
17SIHB2raTq4XwSii2YW1LhkI7fgh1eAk6xba7eGaGv0OuVnAHeXFpk4IaCJmTyx
GcmhSyZZplRCml6+///sNQUQu3GuokKXAxuy0bvnek56Pqv9Wddl4qDebhO7ybnB
62L/hwKBgFZ+OzO5hsPcGj8GwdKeGItVy54SdnsdhPc8bGejDp9vDJjWEYzZ/Wae
MHpD4GyNMeN6XE6lLI7uhLbgOSUTikag0TaBdzqwiuGO+8nmaLGrikFAH6HkqihF
7jd8BY66JCQBIH9SoHLtFAtSPcpRRgny/HnM9eG75PGZmXTisyOX
-----END RSA PRIVATE KEY-----`;

exports.publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1+KWfnOvOvMVHuiTV9bZ
a1ifkloXPG25aauUQdF4ljyBYyTgxge3oI1EN3+WtoJxExrLgADw3VEhdDIsnQVW
5mzV/ks80Tz26q4l7Ck+GynmSM8Zc0LaSsVgul91qkDzSCcfXC97TLXM/9KPSsyw
0fsXkFOW6Ui0+mIEBnn+TxJDWKqjqKOqp+EGOCAS9xMkmUtSXTq4pvZGot0X5xVX
GGRiPGTe1s7gQzn7hENccx64osKBfF1pVvA4HXtffvRwcrpjF9dTbT4MWFJ5CTad
yI8xaX87fjb2pS80jmJR5vWIhVqfmwDbsLYmRV5sGwvTl9h5H9uv07WF5WRM9SoY
ywIDAQAB
-----END PUBLIC KEY-----`;