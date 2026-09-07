import API from '../api';

export function fetchMobilizerProfile() {
	return API.get('/mobilizer/profile');
}

export function updateMobilizerProfile(profile) {
	return API.patch('/mobilizer/profile', profile);
}
