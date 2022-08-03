import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const imagesSchema = new Schema(
	{
		tags: Array,
		owner: {
			type: SchemaTypes.ObjectId,
			ref: 'user',
		},
	},
	{
		versionKey: false,
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
	}
);

// transactionSchema.plugin(mongoosePaginate);

const Images = mongoose.model('Images', imagesSchema);

export default Images;
