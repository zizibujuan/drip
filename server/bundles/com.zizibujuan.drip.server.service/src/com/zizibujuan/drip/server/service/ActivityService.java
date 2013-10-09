package com.zizibujuan.drip.server.service;

import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.util.PageInfo;

/**
 * 活动列表服务
 * @author jinzw
 * @since 0.0.1
 */
public interface ActivityService {

	/**
	 * 获取关注用户的活动列表，分页查询。根据不同的活动类型，所获取的活动内容的属性是不同的，
	 * 所以这里依然使用Map对象存放活动信息。
	 * 
	 * @param pageInfo 分页信息
	 * @param localUserId 本网站为本地用户生成的全局用户标识
	 * @return 活动列表，如果没有则返回空列表
	 * <pre>
	 *  map结构为：
	 *  以下为活动列表中的信息
	 *		userId：本网站用户与第三方网站用户的映射标识
	 *		createTime：活动发生的时间
	 *		contentId：活动输出的内容标识
	 *		actionType：活动类型
	 *		userInfo: 用户信息。FIXME：这里获取的用户信息需要这么多吗，因为用户的名片信息是延迟加载的。
	 *			id: 本地用户标识，即localUserId
	 *			connectUserId：本网站为第三方用户生成的代理主键
	 *			nickName: 显示名
	 *			fanCount：粉丝数
	 *			followCount: 关注人数
	 *			exerDraftCount： 习题草稿数
	 *			exerPublishCount：发布的习题数
	 *			answerCount： 习题总数 = 习题草稿数+发布的习题数
	 *			smallImageUrl: 小头像
	 *			largeImageUrl: 
	 *			largerImageUrl:
	 *			xLargeImageUrl:
	 *			sex: 性别代码
	 *			homeCityCode:家乡所在地代码
	 *			homeCity：家乡所在地
	 *				country：国家
	 *				province：省
	 *				city：市
	 *				county：县
	 *			siteId:网站标识
	 *		exercise: 习题信息
	 *			id: 习题标识
	 *			exerType: 题型
	 *			exerCategory: 习题所属科目
	 *			content: 习题内容
	 *			options: 习题选项
	 *				id：	习题选项标识
	 *				exerId: 所属习题标识
	 *				content： 选项内容
	 *				seq： 选项显示顺序，TODO:支持随机模式，可在客户端处理
	 *			createTime: 创建时间  FIXME：与前面的活动时间冲突。
	 *			updateTime: 更新时间
	 *			createUserId: 创建用户标识
	 *			updateUserId: 更新用户标识
	 *		answer: 答案信息
	 *			id: 答案标识
	 *			exerId: 答案所属习题标识
	 *			guide: 习题解析
	 *			createTime: 创建时间
	 *			updateTime: 更新时间
	 *			createUserId: 创建用户标识 FIXME：是否需要获取答题者的用户信息
	 *			updateUserId: 更新用户标识
	 *			detail：支持1到多个可选答案
	 *				id：答案详情标识
	 *				answerId: 所属答案标识
	 *				optionId: 所选选项标识（习题为选择题时使用）
	 *				content: 所填答案内容
	 * </pre>
	 */
	List<Map<String, Object>> getFollowing(PageInfo pageInfo, Long userId);

	/**
	 * 获取我回答的习题列表
	 * @param pageInfo 分页信息
	 * @param localUserId 为本网站用户生成的全局用户标识
	 * @return 我回答的习题列表，按照时间顺序倒排
	 * <pre>
	 * map结构：
	 * 		
	 * </pre>
	 */
	List<Map<String, Object>> getMyAnswers(PageInfo pageInfo, Long localUserId);

	/**
	 * 获取我录入的习题列表
	 * @param pageInfo 分页信息
	 * @param localUserId 为本网站用户生成的全局用户标识
	 * @return 我录入的习题列表，按照时间顺序倒排
	 * <pre>
	 * map结构：
	 * 		
	 * </pre>
	 */
	List<Map<String, Object>> getMyExercises(PageInfo pageInfo, Long localUserId);

}
