import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import DataHandlerInstance from "../../../utils/DataHandler.ts";
import { Strings } from "../../../utils/enums/index.ts";
import { CacheContext } from "../../Contexts/CacheContext.tsx";
import BasePage from "../BasePage.jsx";
import MessageCard from "./MessageCard.tsx";

function MessagePage() {
	const { cache, setCache } = React.useContext(CacheContext);
	const messages = (cache.messages ?? [])
		.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
		.filter((message) => !message.deleted);

	const unreadMessages = messages.filter((message) => !message.read);
	const readMessages = messages.filter((message) => message.read);

	const handleDelete = (messageID: number) => {
		DataHandlerInstance.messageUpdateDeleted(messageID, true);

		cache.messages.find((message) => message.messageID === messageID)!.deleted = true;

		setCache({...cache});
	};

	const handleMarkAsRead = async (messageID: number) => {
		await DataHandlerInstance.messageUpdateRead(messageID, true);

		cache.messages.find((message) => message.messageID === messageID)!.read = true;

		setCache({...cache});
	};

	return (
		<BasePage title="Messages">
			<Stack
				spacing={2}
				alignItems="center"
				direction="column"
			>
				{
					unreadMessages.length > 0 &&
					<Box>
						<Typography
							gutterBottom
							component="div"
							variant="body1"
							color="GrayText"
							textAlign="center"
						>
							{Strings.UNREAD_MESSAGES}
						</Typography>
						<Stack
							spacing={2}
							alignItems="center"
							direction="column"
						>
							{unreadMessages.map((message, index) => (
								<MessageCard
									key={index}
									message={message}
									onDelete={handleDelete}
									onMarkAsRead={handleMarkAsRead}
								/>
							))}
						</Stack>
						{
							readMessages.length > 0 &&
							<Divider sx={{ mt: 3 }} />
						}
					</Box>
				}
				{
					readMessages.length > 0 &&
					<Stack
						spacing={2}
						alignItems="center"
						direction="column"
					>
						{readMessages.map((message, index) => (
							<MessageCard
								key={index}
								message={message}
								onDelete={handleDelete}
								onMarkAsRead={handleMarkAsRead}
							/>
						))}
					</Stack>
				}
				{
					messages.length === 0 &&
					<Typography
						gutterBottom
						component="div"
						variant="body1"
						color="GrayText"
						textAlign="center"
					>
						{Strings.NO_MESSAGES}
					</Typography>
				}
			</Stack>
		</BasePage>
	);
}

export default MessagePage;
