import { IconBtn } from './IconBtn';
import { FaHeart, FaReply, FaEdit, FaTrash } from 'react-icon/fa';
import { usePost } from '../contexts/PostContext';
import { CommentList } from './CommentList';
import { useState } from 'react';
import { CommentForm } from './CommentForm';
import { createComment } from '../services/comments';
import { useAsyncFn } from '../hooks/useAsync';

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export function Comment({ id, message, user, createdAt }) {
	const [areChildrenHidden, setAreChildrenHidden] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const { post, getReplies, createLocalComment } = usePost();
	const createCommentFn = useAsyncFn(createComment);

	const childComments = getReplies(id);

	function onCommentReply(message) {
		return createCommentFn.execute({ postId: post.id, message, parentId: id }).then((comment) => {
			setIsReplying(false);
			createLocalComment(comment);
		});
	}

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
					<IconBtn
						onClick={() => setIsReplying((prev) => !prev)}
						Icon={FaReply}
						isActive={isReplying}
						aria-label={isReplying ? 'Cancel Reply' : 'Reply'}
					/>
					<IconBtn Icon={FaEdit} aria-label='Edit' />
					<IconBtn Icon={FaTrash} aria-label='Delete' color='danger' />
				</div>
			</div>
			{isReplying && (
				<div className='mt-1 ml-3'>
					<CommentForm autoFocus onSubmit={onCommentReply} loading={createCommentFn.loading} error={createCommentFn.error} />
				</div>
			)}
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
