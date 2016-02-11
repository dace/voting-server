// CORE APP LOGIC

import { List, Map } from 'immutable';

export function setEntries(state, entries) {
	return state.set('entries', List(entries));
}

export function next(state) {
	const entries = state.get('entries')
											 .concat(getWinners(state.get('vote')));

	if (entries.size === 1) {
			return state.remove('vote')
									.remove('entries')
									.set('winner', entries.first());
	} else {
		return state.merge({
			vote: Map({pair: entries.take(2)}),
			entries: entries.skip(2)
		});
	}
}

export function vote(state, entry) {
	return state.updateIn(
		// Succinct way of saying, "reach into this data structure
		// in this order (create it if it doesn't exist),
		// set the default to 0 if it doesn't have a
		// tally, otherwise increment the tally by 1."
		['vote', 'tally', entry],
		0,
		tally => tally + 1
	);
}

function getWinners(vote) {
	if (!vote) return [];

	const [a, b] = vote.get('pair');
	const aVotes = vote.getIn(['tally', a], 0);
	const bVotes = vote.getIn(['tally', b], 0);

	if (aVotes > bVotes) {
		return [a];
	} else if (aVotes < bVotes) {
		return [b];
	} else {
		return [a, b];
	}



}
