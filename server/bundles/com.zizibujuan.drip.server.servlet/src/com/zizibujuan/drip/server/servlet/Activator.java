package com.zizibujuan.drip.server.servlet;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.util.tracker.ServiceTracker;

import com.renren.api.client.RenrenApiConfig;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 启动bundle时,注入系统属性服务
 * @author jzw
 * @since 0.0.1
 */
public class Activator implements BundleActivator {

	private static BundleContext context;
	private ApplicationPropertyService applicationPropertyService;
	private ServiceTracker<ApplicationPropertyService, ApplicationPropertyService> applicationPropertyServiceTracker;

	static BundleContext getContext() {
		return context;
	}
	
	/*
	 * (non-Javadoc)
	 * @see org.osgi.framework.BundleActivator#start(org.osgi.framework.BundleContext)
	 */
	public void start(BundleContext bundleContext) throws Exception {
		Activator.context = bundleContext;
		applicationPropertyServiceTracker = new ServiceTracker<ApplicationPropertyService, ApplicationPropertyService>(bundleContext, ApplicationPropertyService.class, null);
		applicationPropertyServiceTracker.open();
		applicationPropertyService = applicationPropertyServiceTracker.getService();
		
		System.out.println("applicationPropertyService In activator:"+applicationPropertyService);
		
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
