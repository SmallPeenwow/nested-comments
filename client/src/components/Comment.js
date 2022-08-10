import { IconBtn } from './IconBtn';
import { FaHeart, FaReply, FaEdit, FaTrash } from 'react-icon/fa';
import { usePost } from '../contexts/PostContext';
import { CommentList } from './CommentList';
import { useState } from 'react';

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export function Comment({ id, message, user, createdAt }) {
	const [areChildrenHidden, setAreChildrenHidden] = useState(false);
	const { getReplies } = usePost();

	const childComments = getReplies(id);

	return (
		<>
			<div className='comment'>
				<div className='header'>
					<span className='name'>{user.name}</span>
					<span className='date'>{dateFormatter.format(Date.parse(createdAt))}</span>
				</div>
				<div className='message'>{message}</div>
				<div className='footer'>
					<IconBtn Icon={FaHeart} aria-label='like'>
						2
					</IconBtn>
					<IconBtn Icon={FaReply} aria-label='Reply' />
					<IconBtn Icon={FaEdit} aria-label='Edit' />
					<IconBtn Icon={FaTrash} aria-label='Delete' color='danger' />
				</div>
			</div>
			{childComments?.length > 0 && (
				<>
					<div className={`nested-comments-stack ${areChildrenHidden ? 'hide' : ''}`}>
						<button className='collapse-line' aria-label='Hide Replies' onClick={() => setAreChildrenHidden(true)} />
						<div className='nested-comments'>
							<CommentList comments={childComments} />
						</div>
					</div>
					<button className={`btn mt-1 ${!areChildrenHidden ? 'hide' : ''}`} onClick={() => setAreChildrenHidden(false)}>
						Show Replies
					</button>
				</>
			)}
		</>
	);
}
