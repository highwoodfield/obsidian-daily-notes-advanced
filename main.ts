import { moment, App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface DNASettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: DNASettings = {
	mySetting: 'default'
}

const TARGET_FOLDER = "Daily"
const YEAR_FORMAT = "YYYY"
const MONTH_FORMAT = "MM"
const YMD_FORMAT = "YYYY-MM-DD"
const TIME_FORMAT = "HH-mm"

export default class DNAPlugin extends Plugin {
	settings: DNASettings;

	async onload() {
		// await this.loadSettings();

		this.addRibbonIcon('notebook-pen', 'Create New Daily Note', (evt: MouseEvent) => {
			this.createDailyNote()
		});

		// this.addSettingTab(new DNASettingTab(this.app, this));
	}

	async createDailyNote() {
		const now = moment()
		const folderPath = TARGET_FOLDER + "/" + now.format(YEAR_FORMAT) +
			"/" + now.format(MONTH_FORMAT) +
			"/" + now.format(YMD_FORMAT)
		await this.createFolderIfNeeded(folderPath)
		const file = await this.app.vault.create(folderPath + "/" + now.format(TIME_FORMAT) + ".md", "")
		const leaf = this.app.workspace.getLeaf(false)
		leaf.openFile(file)
	}

	async createFolderIfNeeded(path: string) {
		const folder = this.app.vault.getFolderByPath(path)
		if (folder !== null) return
		await this.app.vault.createFolder(path)
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		// await this.saveData(this.settings);
	}
}

class DNASettingTab extends PluginSettingTab {
	plugin: DNAPlugin;

	constructor(app: App, plugin: DNAPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
