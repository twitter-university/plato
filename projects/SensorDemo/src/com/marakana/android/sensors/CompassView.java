package com.marakana.android.sensors;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;
import android.widget.ImageView;

/**
 * The compass rose view. You can set its direction in terms of degrees and it
 * points there.
 */
public class CompassView extends ImageView {
	private static final int DEFAULT = 200;
	private static final int PADDING = 10;
	private static final int RADIUS = 10;
	
	private float degrees = 0;

	public CompassView(Context context, AttributeSet attrs) {
		super(context, attrs);
		setImageResource(R.drawable.rose);
	}

	@Override
	protected void onDraw(Canvas canvas) {
		// Rotate the entire canvas
		canvas.rotate(360-degrees, getWidth()/2, getHeight()/2);

		// Draw the image, as ImageView would've done it
		super.onDraw(canvas);
		
		// Add some custom overlay
		Paint paint = new Paint();
		paint.setAntiAlias(true);
		paint.setColor(0xFFFF0000);
		canvas.drawLine(getWidth() / 2, 0, getWidth() / 2, getHeight(), paint);
		canvas.drawLine(0, getHeight() / 2, getWidth(), getHeight() / 2, paint);
		canvas.drawCircle(getWidth()/2, RADIUS, RADIUS, paint);		
	}
	
	/** Public method to update the degrees for rotating the rose.
	 *  Causes the view to get redrawn.
	 *  @param degrees Value from 0 to 360.
	 */
	public void setDegrees(float degrees) {
		this.degrees = degrees;
		invalidate();
	}

	@Override
	protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
		int size = Math.min(measure(widthMeasureSpec),
				measure(heightMeasureSpec));
		super.setMeasuredDimension(size, size);
	}

	/**
	 * Given measurement specification, returns a measured size.
	 * 
	 * @param spec
	 *            View.MeasureSpec
	 * @return size
	 */
	private int measure(int spec) {
		int size = DEFAULT;
		switch (View.MeasureSpec.getMode(spec)) {
		case View.MeasureSpec.EXACTLY:
			size = View.MeasureSpec.getSize(spec);
			break;
		case View.MeasureSpec.AT_MOST:
			size = View.MeasureSpec.getSize(spec) - PADDING;
			break;
		case View.MeasureSpec.UNSPECIFIED:
			size = View.MeasureSpec.getSize(spec) / 2;
			break;
		}
		return size;
	}
}
