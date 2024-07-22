import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';


export const authOptions = {
    providers: [
        GithubProvider({
            clientId: 'Ov23liS7LFN4YPsSpKyB',
            clientSecret: '11dd64c591f79af5078e76a83c8fae89f27db6f2'
        })
    ]
}



export default NextAuth(authOptions)