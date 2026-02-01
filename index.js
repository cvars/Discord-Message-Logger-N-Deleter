require("dotenv").config();
const fs = require("fs");
const readline = require("readline");
const { Client } = require("discord.js-selfbot-v13"); // selfbot

const client = new Client({ checkUpdate: false });

// helper to ask questions
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

// sanitize folder names
function sanitize(str) {
    return str.replace(/[<>:"/\\|?*]/g, "_");
}

// backup messages function
async function backupDM(dm) {
    const user = dm.recipient;
    const username = sanitize(user.username);
    const dir = `logs/${username}_${user.id}`;
    fs.mkdirSync(dir, { recursive: true });

    console.log(`\nFetching messages with ${user.username} (${user.id})...`);

    let allMessages = [];
    let lastId;

    while (true) {
        const options = { limit: 100 };
        if (lastId) options.before = lastId;

        const messages = await dm.messages.fetch(options);
        if (!messages.size) break;

        allMessages.push(...messages.values());
        lastId = messages.last().id;

        console.log(`Fetched ${allMessages.length} messages so far...`);
    }

    allMessages.reverse();
    const out = allMessages.map(m => {
        const time = m.createdAt.toISOString();
        const attachments = m.attachments.size ? ` [Attachments: ${m.attachments.map(a => a.url).join(", ")}]` : "";
        return `[${time}] ${m.author.username}: ${m.content}${attachments}`;
    }).join("\n");

    fs.writeFileSync(`${dir}/chat.txt`, out);
    console.log(`Saved ${allMessages.length} messages to ${dir}/chat.txt`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// delete all messages you sent to a specific user
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function deleteDM(dm) {
    const user = dm.recipient;
    console.log(`\nFetching all messages in DM with ${user.username} (${user.id})...`);

    let allMessages = [];
    let lastId;

    // Fetch all messages first
    while (true) {
        const options = { limit: 100 };
        if (lastId) options.before = lastId;

        const messages = await dm.messages.fetch(options);
        if (!messages.size) break;

        allMessages.push(...messages.values());
        lastId = messages.last().id;

        console.log(`Fetched ${allMessages.length} messages so far...`);
    }

    // Filter only messages you sent
    const myMessages = allMessages.filter(m => m.author.id === dm.client.user.id);
    console.log(`Found ${myMessages.length} messages to delete.`);

    let deletedCount = 0;
    for (const m of myMessages) {
        await m.delete().catch(() => {}); // ignore errors
        const timestamp = m.createdAt.toISOString();
        console.log(`[${timestamp}] REDACTED deleted`);
        deletedCount++;

        // Wait 900–1050ms between deletes
        await sleep(800 + Math.floor(Math.random() * 250));
    }

    console.log(`Finished deleting. Total deleted: ${deletedCount}`);
}


client.on("ready", async () => {
    console.log(`${client.user.username} is ready!\n`);

    const dms = client.channels.cache.filter(c => c.type === "DM");
    if (!dms.size) {
        console.log("No DMs found.");
        return;
    }

    const dmList = Array.from(dms.values());

    console.log("Select a feature:\n1) Backup a specific DM\n2) Backup all DMs\n3) Delete all messages you sent to a specific user");
    const choice = await askQuestion("Enter 1, 2, or 3: ");

    if (choice === "1") {
        // list DMs
        dmList.forEach((dm, i) => {
            console.log(`${i}) ${dm.recipient.username} | ${dm.id}`);
        });
        const index = parseInt(await askQuestion("\nSelect a DM index: "));
        if (isNaN(index) || index < 0 || index >= dmList.length) {
            console.log("Invalid index");
            process.exit(0);
        }
        await backupDM(dmList[index]);

    } else if (choice === "2") {
        for (const dm of dmList) {
            await backupDM(dm);
        }
        console.log("\nAll DMs have been backed up!");

    } else if (choice === "3") {
        dmList.forEach((dm, i) => {
            console.log(`${i}) ${dm.recipient.username} | ${dm.id}`);
        });
        const index = parseInt(await askQuestion("\nSelect a DM index to delete your messages: "));
        if (isNaN(index) || index < 0 || index >= dmList.length) {
            console.log("Invalid index");
            process.exit(0);
        }
        await deleteDM(dmList[index]);

    } else {
        console.log("Invalid choice");
    }

    process.exit(0);
});

client.login(process.env.TOKEN);
