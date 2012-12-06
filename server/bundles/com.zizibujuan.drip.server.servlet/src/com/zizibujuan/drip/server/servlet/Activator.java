package com.zizibujuan.drip.server.servlet;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.util.tracker.ServiceTracker;
import org.osgi.util.tracker.ServiceTrackerCustomizer;

import com.renren.api.client.RenrenApiConfig;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.util.OAuthConstants;

public class Activator implements BundleActivator {

	private static BundleContext context;
	private ApplicationPropertyService applicationPropertyService;
	private ServiceTracker<ApplicationPropertyService, ApplicationPropertyService> applicationPropertyServiceTracker;

	static BundleContext getContext() {
		return context;
	}
	
	// TODO: 在这里注册ApplicationPropertyService，然后在ServiceHolder中通过调用这里的方法获取该服务。
	private class ApplicationPropertyServiceTracker extends ServiceTracker<ApplicationPropertyService, ApplicationPropertyService>{

		public ApplicationPropertyServiceTracker(
				BundleContext context,
				String clazz,
				ServiceTrackerCustomizer<ApplicationPropertyService, ApplicationPropertyService> customizer) {
			super(context, clazz, customizer);
			// TODO Auto-generated constructor stub
		}
		
	}
	

	/*
	 * (non-Javadoc)
	 * @see org.osgi.framework.BundleActivator#start(org.osgi.framework.BundleContext)
	 */
	public void start(BundleContext bundleContext) throws Exception {
		Activator.context = bundleContext;
		applicationPropertyServiceTracker.open();
		applicationPropertyService = applicationPropertyServiceTracker.getService();
		//applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
		
		String key = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_KEY);
		String secret = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_SECRET);
		
		RenrenApiConfig.renrenApiKey  = key;
		RenrenApiConfig.renrenApiSecret = secret;
	}

	/*
	 * (non-Javadoc)
	 * @see org.osgi.framework.BundleActivator#stop(org.osgi.framework.BundleContext)
	 */
	public void stop(BundleContext bundleContext) throws Exception {
		Activator.context = null;
		if(applicationPropertyServiceTracker != null){
			applicationPropertyServiceTracker.close();
			applicationPropertyServiceTracker = null;
		}
	}

}
