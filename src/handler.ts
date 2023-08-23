import sharp, { AvailableFormatInfo, FitEnum, FormatEnum } from 'sharp';
import { z } from 'zod';

export async function handler(req: Request, env: any) {
	try {
		// validate the params;
		const val = shaperSchema.safeParse(getParams(req));
		if (val.success === false) {
			return new Response(JSON.stringify(val.error), { headers: { 'Content-Type': 'application/json' } });
		}
		const params = val.data;

		// ALLOWED or SIGNED

		const res = await fetchImage(params.url);
		if (res.status !== 200) {
			return new Response('image not found', { status: 404, statusText: 'Image not found' });
		}

		const quality = params.quality;
		const format = params.format ?? res.format;

		if (format === 'svg+xml') {
			return new Response(res.buffer, {
				headers: {
					'Content-Type': 'image/' + format,
					'Cache-Control': 'public, max-age=31536000',
				},
			});
		}

		const position = params.position;
		const background = params.background;
		const output = (params.output ?? format) as keyof FormatEnum | AvailableFormatInfo;
		const compression = params.compression;
		const pipeline = sharp(res.buffer);

		const width = params.width;
		const height = params.height;
		const fit = params.fit as keyof FitEnum;

		if (width || height) {
			pipeline.resize(width, height, { fit, background, position });
		}

		pipeline.toFormat(output, { quality, compression });
		const buffer = await pipeline.toBuffer();

		return new Response(buffer, {
			headers: {
				'Content-Type': 'image/' + format,
				'Cache-Control': 'public, max-age=31536000',
			},
		});
	} catch (error: any) {
		console.log(error);
		return new Response('an error occured');
	}
}

const shaperSchema = z.object({
	url: z.string().url(),
	quality: z.coerce.number().int().min(0).max(100).optional().default(80),
	format: z.enum(['jpeg', 'png', 'webp', 'gif', 'svg']).optional(),
	output: z
		.enum(['jpeg', 'png', 'webp', 'gif', 'jp2', 'tiff', 'avif', 'heif', 'jxi', 'raw', 'tile'])
		.transform((format) => (format === 'avif' ? 'heif' : format))
		.optional(),
	compression: z
		.string()
		.transform((format) => (format === 'avif' ? 'av1' : undefined))
		.optional(),
	width: z.coerce.number().int().positive().optional(),
	height: z.coerce.number().int().positive().optional(),
	background: z.string().default('transparent'),
	fit: z.enum(['cover', 'contain', 'fill', 'inside', 'outside']).default('contain'),
	position: z
		.enum([
			'entropy',
			'attention',
			'north',
			'northeast',
			'east',
			'southeast',
			'south',
			'southwest',
			'west',
			'northwest',
			'center',
			'centre',
			'top',
			'right top',
			'right',
			'right bottom',
			'bottom',
			'left bottom',
			'left',
			'left top',
		])
		.optional()
		.default('center'),
});

function getParams(req: Request): { [key: string]: string } {
	const url = new URL(req.url);
	return Object.fromEntries(Array.from(url.searchParams.entries()));
}

async function fetchImage(url: string): Promise<{ status: number; format?: string; buffer?: ArrayBuffer }> {
	try {
		const res = await fetch(url, { method: 'GET' });
		return {
			status: res.status,
			format: parseFormat(res),
			buffer: await res.arrayBuffer(),
		};
	} catch (e) {
		return { status: 500 };
	}
}

function parseFormat(res: Response) {
	const headers = res.headers;
	const contentType = headers.get('content-type');
	if (contentType?.startsWith('image/')) {
		return contentType.replace('image/', '');
	} else {
		return res.url.split('.').pop();
	}
}
