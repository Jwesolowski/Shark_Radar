import { Card, CardActions, CardContent, IconButton, Tooltip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { MessageModel } from "../../../models/MessageModel.ts";
import { Icons } from "../../../utils/enums/index.ts";

function MessageCard(props: {
	message: MessageModel;
	onDelete: (messageID: number) => void;
	onMarkAsRead: (messageID: number) => void;
}) {
	const { message, onDelete, onMarkAsRead } = props;

	return (
		<Card>
			<CardContent>
				{message.message}
			</CardContent>
			<CardActions disableSpacing>
				<Typography
					sx={{ flexGrow: 1, pl: 1 }}
					variant="body2"
					color="text.secondary"
				>
					{new Date(message.date!).toLocaleString()}
				</Typography>
				{
					!message.read &&
					<Tooltip title="Mark as Read">
						<IconButton
							size="small"
							color="info"
							onClick={() => onMarkAsRead(message.messageID!)}
						>
							<Icons.CHECK fontSize="small" />
						</IconButton>
					</Tooltip>
				}
				<Tooltip title="Delete Message">
					<IconButton
						size="small"
						color="error"
						onClick={() => onDelete(message.messageID!)}
					>
						<Icons.DELETE fontSize="small" />
					</IconButton>
				</Tooltip>
			</CardActions>
		</Card>
	);
}

MessageCard.propTypes = {
	message: PropTypes.object.isRequired
};

export default MessageCard;
