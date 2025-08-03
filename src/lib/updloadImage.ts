import { supabase } from './supabaseClient';

export const uploadImageFromUrl = async (imageUrl: string) => {
	const response = await fetch(imageUrl);
	const blob = await response.blob();

	const fileExt = imageUrl.split('.').pop()?.split('?')[0] || 'png';
	const fileName = `${Date.now()}.${fileExt}`;
	const filePath = fileName;

	const { data, error } = await supabase.storage.from('image').upload(filePath, blob, {
		contentType: blob.type
	});

	if (error) {
		console.error('Upload Error:', error.message);
		return null;
	}

	const { data: publicUrlData } = supabase.storage.from('image').getPublicUrl(filePath);
	return publicUrlData.publicUrl;
};
