package com.zizibujuan.drip.server.servlet;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;
import org.osgi.util.tracker.ServiceTracker;
import org.osgi.util.tracker.ServiceTrackerCustomizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.renren.api.client.RenrenApiConfig;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 启动bundle时,注入系统属性服务
 * @author jzw
 * @since 0.0.1
 */
public class Activator implements BundleActivator {
	private static final Logger logger = LoggerFactory.getLogger(Activator.class);

	private static BundleContext context;
	private ServiceTracker<ApplicationPropertyService, ApplicationPropertyService> applicationPropertyServiceTracker;

	static BundleContext getContext() {
		return context;
	}
	
	private class ApplicationPropertyServiceTracker extends ServiceTracker<ApplicationPropertyService, ApplicationPropertyService>{
		public ApplicationPropertyServiceTracker(
				BundleContext context,
				String clazz,
				ServiceTrackerCustomizer<ApplicationPropertyService, ApplicationPropertyService> customizer) {
			super(context, clazz, customizer);
		}

		@Override
		public ApplicationPropertyService addingService(
				ServiceReference<ApplicationPropertyService> reference) {
			ApplicationPropertyService applicationPropertyService = this.context.getService(reference);
			logger.info("applicationPropertyService In activator:"+applicationPropertyService);
			// TODO:确保依赖的bundle被执行
			String key = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_KEY);
			String secret = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_SECRET);
			
			RenrenApiConfig.renrenApiKey  = key;
			RenrenApiConfig.renrenApiSecret = secret;
			return applicationPropertyService;
		}

		@Override
		public void removedService(
				ServiceReference<ApplicationPropertyService> reference,
				ApplicationPropertyService service) {
			this.context.ungetService(reference);
			super.removedService(reference, service);
		}
		
	}
	
	/*
	 * (non-Javadoc)
	 * @see org.osgi.framework.BundleActivator#start(org.osgi.framework.BundleContext)
	 */
	public void start(BundleContext bundleContext) throws Exception {
		Activator.context = bundleContext;
		applicationPropertyServiceTracker = new ApplicationPropertyServiceTracker(bundleContext, ApplicationPropertyService.class.getName(), null);
		applicationPropertyServiceTracker.open();
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
