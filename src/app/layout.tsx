import React from 'react'
import type {Metadata} from "next"
import "./styles/globals.css"
import {Space_Grotesk} from "next/font/google"

const space_grotesk = Space_Grotesk({subsets: ['latin']})

export const metadata: Metadata = {
	title: "Ankit's portfolio"
}

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="en">
		<body className={space_grotesk.className}>
			{children}
		</body>
		</html>
	);
}
