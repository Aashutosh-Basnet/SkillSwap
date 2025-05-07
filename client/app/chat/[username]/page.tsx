export default async function ChatPage({
    params,
}:{
    params: Promise<{username: string}>;
}) {
    const username = (await params).username;
    return <h1>Username: {username}</h1>
}