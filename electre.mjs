

const tokenUrl = process.env.TOKEN_URL || "https://login.electre-ng-horsprod.com/auth/realms/electre/protocol/openid-connect/token";
const getEanUrl = process.env.GET_EAN_URL || "https://api.demo.electre-ng-horsprod.com/notices/eans";
const username = process.env.USERNAME || "";
const password = process.env.PASSWORD || "";

console.log("tokenURL: ", tokenUrl);
console.log("getEANSURL: ", getEanUrl);
console.log("username: ", username);
console.log("password: ", password);

async function getAccessToken() {
    const url = tokenUrl;

    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', 'api-client');
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            if (data.access_token) {
                return data.access_token;
            } else {
                console.error('Access token not found in the response');
            }
        } else {
            console.error(`HTTP request failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error making HTTP request: ${error.message}`);
    }
}

async function makeHttpRequests(eanArray, url, bearerToken) {
    const batchSize = 99;
    const results = [];

    const batches = [];
    for (let i = 0; i < eanArray.length; i += batchSize) {
        const batch = eanArray.slice(i, i + batchSize);
        batches.push(batch);
    }

    for (const batch of batches) {
        const queryParams = batch.map(ean => `ean=${ean}`).join('&');
        const requestUrl = `${url}?${queryParams}`;

        try {
            const response = await fetch(requestUrl, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.notices) {
                    results.push(data.notices);
                }
            } else {
                console.error(`HTTP request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error making HTTP request: ${error.message}`);
        }
    }

    const aggregatedResponse = results.flat();
    return aggregatedResponse;
}

/**
 * 
 * @param {string[]} eanArray 
 */
export async function getNoticesFromElectre(eanArray) {

    const token = await getAccessToken();

    const notices = await makeHttpRequests(eanArray, getEanUrl, token)

    return notices;
}