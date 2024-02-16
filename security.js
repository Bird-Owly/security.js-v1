const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const noblox = require('noblox.js');
const mongoose = require('mongoose');
const SecurityModel = require('../../Schemas/securitySchema');
const CheckUserModel = require('../../Schemas/checkUser');

// This code is owned, edited, and operated by Thoughtful Therapy
// By viewing, copying, downloading, distributing, and/or editing this code, you agree and acknowledge to our developer terms along with our other guidelines

module.exports = {
	data: new SlashCommandBuilder()
		.setName('security')
		.setDescription('View and configure your security settings for TheraFy'),

    async execute(interaction) {

        const securityDoc = await SecurityModel.findOne({ memberID: interaction.user.id });
        if (!securityDoc) {
            const noSecurityEmbed = new EmbedBuilder()
                .setTitle('Security Overview')
                .setDescription('No security data was found for you. If you wish to configure account security, follow the buttons below.')
                .setColor('#77dd77')
                .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&');

            noSecurityEmbed.setFooter({
                iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                text: 'TheraFy 10 • Operated by Thoughtful Therapy'
            });

            const configure = new ButtonBuilder()
                .setCustomId('configure')
                .setLabel('Configure Security')
                .setStyle(ButtonStyle.Success);

            const goback = new ButtonBuilder()
                .setCustomId('goback')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger);

            const configureRow = new ActionRowBuilder()
                .addComponents(configure, goback);

            const noSecurityResponse = await interaction.reply({ embeds: [noSecurityEmbed], components: [configureRow], ephemeral: true });
            const collectorFilter = i => i.user.id === interaction.user.id;
            const nextStep = await noSecurityResponse.awaitMessageComponent({ filter: collectorFilter });

            try {
                if (nextStep.customId === 'configure') {
                    const findVerifiedUser = await CheckUserModel.findOne({ memberID: interaction.user.id });
                    if (!findVerifiedUser) {
                        await nextStep.update({ embeds: [], components: [], content: 'You are not verified with any Roblox account. Please verify yourself in this server or any server that uses TheraFy to configure your account security.', ephemeral: true });
                    } else if (findVerifiedUser) {
                        const username = findVerifiedUser.robloxUsername;
                        const usernameID = Number(await noblox.getIdFromUsername(username));
                        let thumbnail_circHeadshot = await noblox.getPlayerThumbnail(usernameID, 420, "png", true, "Headshot");
                        let avatarUrl = thumbnail_circHeadshot[0].imageUrl;
                        const securityOwnershipEmbed = new EmbedBuilder()
                            .setTitle('Ownership Configuration')
                            .setDescription(`By default, ${username} will be set as the official Roblox account you hold. This is done to better protect you and prevent false verification requests from being made. If you wish to set a different account as your owner, please unverify your account globally by running **/unverify** and selecting the global option.`)
                            .setColor('#77dd77')
                            .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&')
                            .setImage(avatarUrl);

                        securityOwnershipEmbed.setFooter({
                            iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                            text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                        });

                        const continueButton = new ButtonBuilder()
                            .setCustomId('continueConf')
                            .setLabel('Continue')
                            .setStyle(ButtonStyle.Success);

                        const cancelButton = new ButtonBuilder()
                            .setCustomId('cancelButton')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Danger);

                        const continueNextRow = new ActionRowBuilder()
                            .addComponents(continueButton, cancelButton);

                        const nextContinueResponse = await nextStep.update({ embeds: [securityOwnershipEmbed], components: [continueNextRow], ephemeral: true });
                        const nextContinue = await nextContinueResponse.awaitMessageComponent({ filter: collectorFilter });

                        if (nextContinue.customId === 'continueConf') {
                            const securityNotificationEmbed = new EmbedBuilder()
                                .setTitle('Security Notifications')
                                .setDescription('TheraFy will send you security notifications everytime a Discord account is linked with your Roblox account in a server using TheraFy. This is done to alert you of possible false verification requests. ***You can choose to configure when you recieve the notifications with the options below:***\n\n- **Basic Notifications - Notifies you of when another Discord account is linked with your Roblox account**\n- **Advanced Notifications - Notifies you everytime a Discord account is linked with your Roblox account in a server**\n- **No Notifications - Does not provide you with any security notifications (not ideal)**')
                                .setColor('#77dd77')
                                .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&');

                            securityNotificationEmbed.setFooter({
                                iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                            });

                            const advancedNotifications = new ButtonBuilder()
                                .setCustomId('advanced')
                                .setLabel('Advanced Notifications')
                                .setStyle(ButtonStyle.Success);

                            const basicNotifications = new ButtonBuilder()
                                .setCustomId('basic')
                                .setLabel('Basic Notifications')
                                .setStyle(ButtonStyle.Secondary);

                            const noNotifications = new ButtonBuilder()
                                .setCustomId('noNotify')
                                .setLabel('No Notifications')
                                .setStyle(ButtonStyle.Danger);

                            const notificationTypeRow = new ActionRowBuilder()
                                .addComponents(advancedNotifications, basicNotifications, noNotifications);

                            const beforeFinish = await nextContinue.update({ embeds: [securityNotificationEmbed], components: [notificationTypeRow], ephemeral: true });
                            const beforeFinishStep = await beforeFinish.awaitMessageComponent({ filter: collectorFilter });

                            if (beforeFinishStep.customId === 'advanced') {
                                const configurationOverviewEmbed = new EmbedBuilder()
                                    .setTitle('Configuration Overview')
                                    .setDescription(`***Below are the details for your security configuration:***\n\n- **Account you Hold: ${username}**\n- **Notification Type: Advanced**`)
                                    .setColor('#77dd77')
                                    .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&')
                                    .setImage(avatarUrl);

                                configurationOverviewEmbed.setFooter({
                                    iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                    text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                                });

                                const finish1 = new ButtonBuilder()
                                    .setCustomId('finish1')
                                    .setLabel('Finish Configuration')
                                    .setStyle(ButtonStyle.Success);

                                const cancel1 = new ButtonBuilder()
                                    .setCustomId('cancel1')
                                    .setLabel('Cancel Configuration')
                                    .setStyle(ButtonStyle.Danger);

                                const almostDoneRow = new ActionRowBuilder()
                                    .addComponents(finish1, cancel1);

                                const finalConfigResponse = await beforeFinishStep.update({ embeds: [configurationOverviewEmbed], components: [almostDoneRow], ephemeral: true });
                                const finalConfig = await finalConfigResponse.awaitMessageComponent({ filter: collectorFilter });

                                if (finalConfig.customId === 'finish1') {
                                    const newSecurityDoc = new SecurityModel({
                                        robloxUsername: username,
                                        memberID: interaction.user.id,
                                        status: 'All Good',
                                        mainAccountHolder: username,
                                        securityAccountType: 'Main Owner',
                                        securityNotification: 'Advanced',
                                    });

                                    await newSecurityDoc.save().catch(err => console.log(err));

                                    const findSecurityDoc = await SecurityModel.findOne({ memberID: interaction.user.id });
                                    const securityEmbed = new EmbedBuilder()
                                        .setTitle('Security Overview')
                                        .setDescription('**Your configuration was successful. You can find the overview of your security settings below. To re-configure the settings or delete them, run /security again.**')
                                        .setColor('#77dd77')
                                        .setThumbnail(avatarUrl)
                                        .addFields(
                                            { name: 'Linked Account', value: `${findSecurityDoc.robloxUsername}`, inline: true },
                                            { name: 'Discord ID', value: `${findSecurityDoc.memberID}`, inline: true },
                                            { name: 'Security Status', value: `${findSecurityDoc.status}`, inline: true },
                                            { name: 'Account you Own', value: `${findSecurityDoc.mainAccountHolder}`, inline: true },
                                            { name: 'Account Holder Type', value: `${findSecurityDoc.securityAccountType}`, inline: true },
                                            { name: 'Notification Type', value: `${findSecurityDoc.securityNotification}`, inline: true },
                                        );

                                    securityEmbed.setFooter({
                                        iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                        text: 'TheraFy 10 • Operated by Thoughtful Therapy' 
                                    });

                                    await finalConfig.update({ embeds: [securityEmbed], components: [], ephemeral: true });

                                } else if (finalConfig.customId === 'cancel1') {
                                    await finalConfig.update({ embeds: [], components: [], content: 'Security configuration process canceled', ephemeral: true });
                                }
                            } else if (beforeFinishStep.customId === 'basic') {
                                const configurationOverviewEmbed1 = new EmbedBuilder()
                                    .setTitle('Configuration Overview')
                                    .setDescription(`***Below are the details for your security configuration:***\n\n- **Account you Hold: ${username}**\n- **Notification Type: Basic**`)
                                    .setColor('#77dd77')
                                    .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&')
                                    .setImage(avatarUrl);

                                configurationOverviewEmbed1.setFooter({
                                    iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                    text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                                });

                                const finish2 = new ButtonBuilder()
                                    .setCustomId('finish2')
                                    .setLabel('Finish Configuration')
                                    .setStyle(ButtonStyle.Success);

                                const cancel2 = new ButtonBuilder()
                                    .setCustomId('cancel2')
                                    .setLabel('Cancel Configuration')
                                    .setStyle(ButtonStyle.Danger);

                                const confirmRow2 = new ActionRowBuilder()
                                    .addComponents(finish2, cancel2);

                                const finishResponse2 = await beforeFinishStep.update({ embeds: [configurationOverviewEmbed1], components: [confirmRow2], ephemeral: true });
                                const finish21 = await finishResponse2.awaitMessageComponent({ filter: collectorFilter });

                                if (finish21.customId === 'finish2') {
                                    const newSecurityDoc2 = new SecurityModel({
                                        robloxUsername: username,
                                        memberID: interaction.user.id,
                                        status: 'All Good',
                                        mainAccountHolder: username,
                                        securityAccountType: 'Main Owner',
                                        securityNotification: 'Basic',
                                    });

                                    await newSecurityDoc2.save().catch(err => console.log(err));

                                    const findSecurityDoc2 = await SecurityModel.findOne({ memberID: interaction.user.id });
                                    const securityEmbed2 = new EmbedBuilder()
                                        .setTitle('Security Overview')
                                        .setDescription('**Your configuration was successful. You can find the overview of your security settings below. To re-configure the settings or delete them, run /security again.**')
                                        .setColor('#77dd77')
                                        .setThumbnail(avatarUrl)
                                        .addFields(
                                            { name: 'Linked Account', value: `${findSecurityDoc2.robloxUsername}`, inline: true },
                                            { name: 'Discord ID', value: `${findSecurityDoc2.memberID}`, inline: true },
                                            { name: 'Security Status', value: `${findSecurityDoc2.status}`, inline: true },
                                            { name: 'Owner of Account', value: `${findSecurityDoc2.mainAccountHolder}`, inline: true },
                                            { name: 'Account you Own', value: `${findSecurityDoc2.securityAccountType}`, inline: true },
                                            { name: 'Notification Type', value: `${findSecurityDoc2.securityNotification}`, inline: true },
                                        );

                                    securityEmbed2.setFooter({
                                        iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                        text: 'TheraFy 10 • Operated by Thoughtful Therapy' 
                                    });

                                    await finish21.update({ embeds: [securityEmbed2], components: [], ephemeral: true });
                                } else if (finish21.customId === 'cancel2') {
                                    await finish21.update({ embeds: [], components: [], content: 'Security configuration process canceled', ephemeral: true });
                                }


                            } else if (beforeFinishStep.customId ==='noNotify') {
                                const configurationOverviewEmbed3 = new EmbedBuilder()
                                .setTitle('Configuration Overview')
                                .setDescription(`***Below are the details for your security configuration:***\n\n- **Account you Hold: ${username}**\n- **Notification Type: None**`)
                                .setColor('#77dd77')
                                .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&')
                                .setImage(avatarUrl);

                            configurationOverviewEmbed3.setFooter({
                                iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                            });

                            const finish3 = new ButtonBuilder()
                                .setCustomId('finish3')
                                .setLabel('Finish Configuration')
                                .setStyle(ButtonStyle.Success);

                            const cancel3 = new ButtonBuilder()
                                .setCustomId('cancel3')
                                .setLabel('Cancel Configuration')
                                .setStyle(ButtonStyle.Danger);

                            const confirmRow3 = new ActionRowBuilder()
                                .addComponents(finish3, cancel3);

                            const finish213Response = await beforeFinishStep.update({ embeds: [configurationOverviewEmbed3], components: [confirmRow3], ephemeral: true });
                            const finish213 = await finish213Response.awaitMessageComponent({ filter: collectorFilter });

                            if (finish213.customId === 'finish3') {
                                const newSecurityDoc3 = new SecurityModel({
                                    robloxUsername: username,
                                    memberID: interaction.user.id,
                                    status: 'All Good',
                                    mainAccountHolder: username,
                                    securityAccountType: 'Main Owner',
                                    securityNotification: 'None',
                                });

                                await newSecurityDoc3.save().catch(err => console.log(err));

                                const findSecurityDoc3 = await SecurityModel.findOne({ memberID: interaction.user.id });
                                const securityEmbed3 = new EmbedBuilder()
                                    .setTitle('Security Overview')
                                    .setDescription('**Your configuration was successful. You can find the overview of your security settings below. To re-configure the settings or delete them, run /security again.**')
                                    .setColor('#77dd77')
                                    .setThumbnail(avatarUrl)
                                    .addFields(
                                        { name: 'Linked Account', value: `${findSecurityDoc3.robloxUsername}`, inline: true },
                                        { name: 'Discord ID', value: `${findSecurityDoc3.memberID}`, inline: true },
                                        { name: 'Security Status', value: `${findSecurityDoc3.status}`, inline: true },
                                        { name: 'Owner of Account', value: `${findSecurityDoc3.mainAccountHolder}`, inline: true },
                                        { name: 'Account you Own', value: `${findSecurityDoc3.securityAccountType}`, inline: true },
                                        { name: 'Notification Type', value: `${findSecurityDoc3.securityNotification}`, inline: true },
                                    );

                                securityEmbed3.setFooter({
                                    iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                    text: 'TheraFy 10 • Operated by Thoughtful Therapy' 
                                });

                                await finish213.update({ embeds: [securityEmbed3], components: [], ephemeral: true });
                            } else if (finish213.customId === 'cancel3') {
                                await finish213.update({ embeds: [], components: [], content: 'Security configuration process canceled', ephemeral: true });
                            }

                        }

                        } else if (nextContinue.customId === 'cancelButton') {
                            await nextContinue.update({ embeds: [], components: [], content: 'Security configuration process canceled', ephemeral: true });
                        }
                    }
                } else if (nextStep.customId === 'goback') {
                    await nextStep.update({ embeds: [], components: [], content: 'Security configuration canceled', ephemeral: true });
                }
            } catch (error) {
                console.error(error);
            }
        } else if (securityDoc) {
            const securityUsername = securityDoc.robloxUsername;
            const securityUsernameID = Number(await noblox.getIdFromUsername(securityUsername));
            let thumbnail_securityHeadshot = await noblox.getPlayerThumbnail(securityUsernameID, 420, "png", true, "Headshot");
            let avatarUrlsecurity = thumbnail_securityHeadshot[0].imageUrl;
            
            const securityOverviewExistingEmbed = new EmbedBuilder()
            .setTitle('Security Overview')
            .setDescription('**Your security settings and similar data can be found below. To re-configure or delete the settings, click on the buttons.**')
            .setColor('#77dd77')
            .setThumbnail(avatarUrlsecurity)
            .addFields(
                { name: 'Linked Account', value: `${securityDoc.robloxUsername}`, inline: true },
                { name: 'Discord ID', value: `${securityDoc.memberID}`, inline: true },
                { name: 'Security Status', value: `${securityDoc.status}`, inline: true },
                { name: 'Account you Own', value: `${securityDoc.mainAccountHolder}`, inline: true },
                { name: 'Account Holder Type', value: `${securityDoc.securityAccountType}`, inline: true },
                { name: 'Notification Type', value: `${securityDoc.securityNotification}`, inline: true },
            );

            securityOverviewExistingEmbed.setFooter({
                iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                text: 'TheraFy 10 • Operated by Thoughtful Therapy' 
            });

            const reConfigure = new ButtonBuilder()
                .setCustomId('reConfigure')
                .setLabel('Re-configure Settings')
                .setStyle(ButtonStyle.Success);

            const deleteSettings = new ButtonBuilder()
                .setCustomId('deleteSettings')
                .setLabel('Delete Settings')
                .setStyle(ButtonStyle.Danger);

            const settingsConfRow = new ActionRowBuilder()
                .addComponents(reConfigure, deleteSettings);

            const settingsOverviewResponse1 = await interaction.reply({ embeds: [securityOverviewExistingEmbed], components: [settingsConfRow], ephemeral: true });
            const collectorFilter2 = i => i.user.id === interaction.user.id;
            const settingsOverview1 = await settingsOverviewResponse1.awaitMessageComponent({ filter: collectorFilter2 });

            if (settingsOverview1.customId === 'reConfigure') {
                const reconfEmbed = new EmbedBuilder()
                    .setTitle('Configuration Panel')
                    .setDescription('Choose to switch your notification types, report a security concern, or change your head account.')
                    .setColor('#77dd77')
                    .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&');

                reconfEmbed.setFooter({
                    iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                    text: 'TheraFy 10 • Operated by Thoughtful Therapy' 
                });

                const editnotis = new ButtonBuilder()
                    .setCustomId('editnotif')
                    .setLabel('Edit Notifications')
                    .setStyle(ButtonStyle.Primary);

                const reportSecur = new ButtonBuilder()
                    .setCustomId('report')
                    .setLabel('Customer/Security Support')
                    .setStyle(ButtonStyle.Primary);

                const changeHold = new ButtonBuilder()
                    .setCustomId('changehold')
                    .setLabel('Edit Head Account')
                    .setStyle(ButtonStyle.Primary);

                const cancelReConfig = new ButtonBuilder()
                    .setCustomId('cancelReConfig')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger);

                const reconfigRow1 = new ActionRowBuilder()
                    .addComponents(editnotis, reportSecur, changeHold, cancelReConfig);

                const reconf1Response = await settingsOverview1.update({ embeds: [reconfEmbed], components: [reconfigRow1], ephemeral: true });
                const reconf1 = await reconf1Response.awaitMessageComponent({ filter: collectorFilter2 });

                if (reconf1.customId === 'editnotif') {
                    const notifTypeDoc = await SecurityModel.findOne({ memberID: interaction.user.id });

                    if (!notifTypeDoc) {

                    } else if (notifTypeDoc) {
                        const notifType = notifTypeDoc.securityNotification;

                        const viewNotifTypeEmbed = new EmbedBuilder()
                            .setTitle('Notification Settings')
                            .setDescription(`Your current security notification type is located below (change the settings by clicking on the buttons): \n\n- **${notifType}**`)
                            .setColor('#77dd77')
                            .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&');

                        viewNotifTypeEmbed.setFooter({ 
                            imageUrl: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                            text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                        });

                        const advancedNotif = new ButtonBuilder()
                            .setCustomId('advancedNotifReconf')
                            .setLabel('Advanced Notifications')
                            .setStyle(ButtonStyle.Success);

                        const basicNotif = new ButtonBuilder()
                            .setCustomId('basicNotifReconfig')
                            .setLabel('Basic Notifications')
                            .setStyle(ButtonStyle.Primary);

                        const noNotif = new ButtonBuilder()
                            .setCustomId('noNotifReconfig')
                            .setLabel('No Notifications')
                            .setStyle(ButtonStyle.Danger);

                        const cancelReConfigNotif = new ButtonBuilder()
                            .setCustomId('cancelReconfigNotifs')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Danger);

                        const reConfigNotifsRow = new ActionRowBuilder()
                            .addComponents(advancedNotif, basicNotif, noNotif, cancelReConfigNotif);

                        const reconf2Response = await reconf1.update({ embeds: [viewNotifTypeEmbed], components: [reConfigNotifsRow], ephemeral: true });
                        const reconf2 = await reconf2Response.awaitMessageComponent({ filter: collectorFilter2 });

                        if (reconf2.customId === 'advancedNotifReconf') {
                            const reconfigOverviewEmbed1 = new EmbedBuilder()
                            .setTitle('Notification Overview')
                            .setDescription(`This is an overview of your notification preferences:\n\n- **Notification Type: Advanced (Sends security notifications everytime your Roblox account is linked with another Discord account via TheraFy)**`)
                            .setColor('#77dd77')
                            .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&');

                        reconfigOverviewEmbed1.setFooter({ 
                            iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                            text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                        });

                        const confirm1 = new ButtonBuilder()
                            .setCustomId('confirm1')
                            .setLabel('Confirm Settings')
                            .setStyle(ButtonStyle.Success);

                        const cancel1 = new ButtonBuilder()
                            .setCustomId('cancel1')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Danger);

                        const confirmReConfRow1 = new ActionRowBuilder()
                            .addComponents(confirm1, cancel1);

                        const reconf3Response = await reconf2.update({ embeds: [reconfigOverviewEmbed1], components: [confirmReConfRow1], ephemeral: true });
                        const reconf3 = await reconf3Response.awaitMessageComponent({ filter: collectorFilter2 });

                        if (reconf3.customId === 'confirm1') {
                            const filter1 = ({ memberID: interaction.user.id });
                            const update1 = ({ securityNotification: 'Advanced' });
                            const securityDocAdvanced = await SecurityModel.findOneAndUpdate(filter1, update1, { new: true });
                            const newnotifEmbed1 = new EmbedBuilder()
                            .setTitle('Security Overview')
                            .setDescription('Your notification preferences were updated successfully. You can find the rest of your security data below:')
                            .setColor('#77dd77')
                            .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&')
                            .addFields(
                                { name: 'Linked Account', value: `${securityDocAdvanced.robloxUsername}`, inline: true },
                                { name: 'Discord ID', value: `${securityDocAdvanced.memberID}`, inline: true },
                                { name: 'Security Status', value: `${securityDocAdvanced.status}`, inline: true },
                                { name: 'Account you Own', value: `${securityDocAdvanced.mainAccountHolder}`, inline: true },
                                { name: 'Account Holder Type', value: `${securityDocAdvanced.securityAccountType}`, inline: true },
                                { name: 'Notification Type', value: `${securityDocAdvanced.securityNotification}`, inline: true },
                            );

                            newnotifEmbed1.setFooter({
                                iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                            });

                            await reconf3.update({ embeds: [newnotifEmbed1], components: [], ephemeral: true });

                        } else if (reconf3.customId === 'cancel1') {
                            await reconf3.update({ embeds: [], components: [], content: 'Re-configuration process canceled', ephemeral: true });
                        }
                        } else if (reconf2.customId === 'basicNotifReconfig')  {
                            const reconfigOverviewEmbed2 = new EmbedBuilder()
                            .setTitle('Notification Overview')
                            .setDescription(`This is an overview of your notification preferences:\n\n- **Notification Type: Basic (Sends security notifications everytime your Roblox account is linked with another Discord account that is this Discord account via TheraFy)**`)
                            .setColor('#77dd77')
                            .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&');

                        reconfigOverviewEmbed2.setFooter({ 
                            iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                            text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                        });

                        const confirm2 = new ButtonBuilder()
                            .setCustomId('confirm2')
                            .setLabel('Confirm Settings')
                            .setStyle(ButtonStyle.Success);

                        const cancel2 = new ButtonBuilder()
                            .setCustomId('cancel2')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Danger);

                        const confirmReConfRow2 = new ActionRowBuilder()
                            .addComponents(confirm2, cancel2);

                        const reconf4Response = await reconf2.update({ embeds: [reconfigOverviewEmbed2], components: [confirmReConfRow2], ephemeral: true });
                        const reconf4 = await reconf4Response.awaitMessageComponent({ filter: collectorFilter2 });

                        if (reconf4.customId === 'confirm2') {
                            const filter2 = ({ memberID: interaction.user.id });
                            const update2 = ({ securityNotification: 'Basic' });
                            const securityDocAdvanced2 = await SecurityModel.findOneAndUpdate(filter2, update2, { new: true });
                            const newnotifEmbed2 = new EmbedBuilder()
                            .setTitle('Security Overview')
                            .setDescription('Your notification preferences were updated successfully. You can find the rest of your security data below:')
                            .setColor('#77dd77')
                            .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&')
                            .addFields(
                                { name: 'Linked Account', value: `${securityDocAdvanced2.robloxUsername}`, inline: true },
                                { name: 'Discord ID', value: `${securityDocAdvanced2.memberID}`, inline: true },
                                { name: 'Security Status', value: `${securityDocAdvanced2.status}`, inline: true },
                                { name: 'Account you Own', value: `${securityDocAdvanced2.mainAccountHolder}`, inline: true },
                                { name: 'Account Holder Type', value: `${securityDocAdvanced2.securityAccountType}`, inline: true },
                                { name: 'Notification Type', value: `${securityDocAdvanced2.securityNotification}`, inline: true },
                            );

                            newnotifEmbed2.setFooter({
                                iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                            });

                            await reconf4.update({ embeds: [newnotifEmbed2], components: [], ephemeral: true });

                        } else if (reconf4.customId === 'cancel2') {
                            await reconf4.update({ embeds: [], components: [], content: 'Re-configuration process canceled', ephemeral: true });
                        }

                        } else if (reconf2.customId === 'noNotifReconfig') {

                            const reconfigOverviewEmbed3 = new EmbedBuilder()
                            .setTitle('Notification Overview')
                            .setDescription(`This is an overview of your notification preferences:\n\n- **Notification Type: None (No security notifications will be sent to you, this is not recommended)**`)
                            .setColor('#77dd77')
                            .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&');

                        reconfigOverviewEmbed3.setFooter({ 
                            iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                            text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                        });

                        const confirm3 = new ButtonBuilder()
                            .setCustomId('confirm3')
                            .setLabel('Confirm Settings')
                            .setStyle(ButtonStyle.Success);

                        const cancel3 = new ButtonBuilder()
                            .setCustomId('cancel3')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Danger);

                        const confirmReConfRow3 = new ActionRowBuilder()
                            .addComponents(confirm3, cancel3);

                        const reconf5Response = await reconf2.update({ embeds: [reconfigOverviewEmbed3], components: [confirmReConfRow3], ephemeral: true });
                        const reconf5 = await reconf5Response.awaitMessageComponent({ filter: collectorFilter2 });

                        if (reconf5.customId === 'confirm3') {
                            const filter3 = ({ memberID: interaction.user.id });
                            const update3 = ({ securityNotification: 'None' });
                            const securityDocAdvanced3 = await SecurityModel.findOneAndUpdate(filter3, update3, { new: true });
                            const newnotifEmbed3 = new EmbedBuilder()
                            .setTitle('Security Overview')
                            .setDescription('Your notification preferences were updated successfully. You can find the rest of your security data below:')
                            .setColor('#77dd77')
                            .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&')
                            .addFields(
                                { name: 'Linked Account', value: `${securityDocAdvanced3.robloxUsername}`, inline: true },
                                { name: 'Discord ID', value: `${securityDocAdvanced3.memberID}`, inline: true },
                                { name: 'Security Status', value: `${securityDocAdvanced3.status}`, inline: true },
                                { name: 'Account you Own', value: `${securityDocAdvanced3.mainAccountHolder}`, inline: true },
                                { name: 'Account Holder Type', value: `${securityDocAdvanced3.securityAccountType}`, inline: true },
                                { name: 'Notification Type', value: `${securityDocAdvanced3.securityNotification}`, inline: true },
                            );

                            newnotifEmbed3.setFooter({
                                iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                                text: 'TheraFy 10 • Operated by Thoughtful Therapy'
                            });

                            await reconf5.update({ embeds: [newnotifEmbed3], components: [], ephemeral: true });

                        } else if (reconf5.customId === 'cancel3') {
                            await reconf5.update({ embeds: [], components: [], content: 'Re-configuration process canceled', ephemeral: true });
                        }

                        } else if (reconf2.customId === 'cancelReconfigNotifs') {
                            await reconf2.update({ embeds: [], components: [], content: 'Notification re-configuration process canceled', ephemeral: true });
                        }
                    }
                } else if (reconf1.customId === 'report') {

                } else if (reconf1.customId === 'changehold') {

                } else if (reconf1.customId === 'cancelReConfig') {

                }


                
            } else if (settingsOverview1.customId === 'deleteSettings') {
                const areYouSureEmbed = new EmbedBuilder()
                    .setTitle('Are you sure?')
                    .setDescription('**The following below will happen if you delete the settings:**\n\n- **You will not recieve any security notifications**\n- **You will not be able to recieve advanced customer support regarding account security**\n- **Any other important data established from the security configurations will be lost**\n- **This action can not be undone**\n- **You will need to re-configure your security settings once you have deleted your current ones if you wish to re-establish your settings**\n\n***Are you sure that you want to do this?***')
                    .setColor('#77dd77')
                    .setThumbnail('https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&');

                areYouSureEmbed.setFooter({
                        iconURL: 'https://cdn.discordapp.com/attachments/1153892118528532490/1204602853336031262/therafy_logo.png?ex=65d554d4&is=65c2dfd4&hm=86d62f3188eeb8d5808b88f5683fb284f55f5cddb8810cb58f8b7611bd0f37e9&',
                        text: 'TheraFy 10 • Operated by Thoughtful Therapy' 
                    });

                const yesButton = new ButtonBuilder()
                    .setCustomId('yesButton')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success);

                const noButton = new ButtonBuilder()
                    .setCustomId('noButton')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger);

                const areYouSureRow = new ActionRowBuilder()
                    .addComponents(yesButton, noButton);

                const deleteConfResponse = await settingsOverview1.update({ embeds: [areYouSureEmbed], components: [areYouSureRow], ephemeral: true });
                const deleteConf = await deleteConfResponse.awaitMessageComponent({ filter: collectorFilter2 });

                if (deleteConf.customId === 'yesButton') {
                    await SecurityModel.deleteOne({ memberID: interaction.user.id });
                    await deleteConf.update({ embeds: [], components: [], content: 'Security data has been deleted', ephemeral: true });
                } else if (deleteConf.customId === 'noButton') {
                    await deleteConf.update({ embeds: [], components: [], content: 'Deletion process canceled', ephemeral: true });
                }

            }
        }
	},
};