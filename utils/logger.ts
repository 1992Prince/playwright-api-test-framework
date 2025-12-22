
export class APILogger {

    private recentLogs: any[] = [];

    logRequest(method: string, url: string, headers: Record<string, string>, body?: any) {
        const logEntry = { method, url, headers, body };
        this.recentLogs.push({ type: 'Request Details', data: logEntry });
    }

    logResponse(statusCode: number, body?: any) {
        const logEntry = { statusCode, body };
        this.recentLogs.push({ type: 'Response Details', data: logEntry });
    }

    // interview question - where u have used map method in framework and why
    getRecentLogs() {
        const logs = this.recentLogs.map(log => {
            return `=== ${log.type} ===\n${JSON.stringify(log.data, null, 4)}`;
        }).join('\n\n');

        return logs;
    }

    /** ✅ Clear recent logs */
    clearLogs() {
        this.recentLogs = [];
    }
}



// test

// const logger = new APILogger();

// logger.logRequest('GET', 'https://api.example.com/users', {'Accept': 'application/json'}, null);
// logger.logResponse(200, { users: [{ id: 1, name: 'Alice' }] });

// console.log(logger.getRecentLogs());

// Sample console output:

/**
=== Request Details ===
{
    "method": "GET",
    "url": "https://api.example.com/users",
    "headers": {
        "Accept": "application/json"
    },
    "body": null
}

=== Response Details ===
{
    "statusCode": 200,
    "body": {
        "users": [
            {
                "id": 1,
                "name": "Alice"
            }
        ]
    }
}

 */

