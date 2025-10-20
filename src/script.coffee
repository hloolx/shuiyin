# 批量图片水印工具 - 现代化版本
$ = (sel) -> document.querySelector sel
$$ = (sel) -> document.querySelectorAll sel

# 全局变量
inputItems = ['text', 'color', 'alpha', 'angle', 'space', 'size']
input = {}
files = []
currentImageIndex = -1
canvases = {}

# DOM 元素
imageInput = null
uploadArea = null
imageList = null
previewContainer = null
fileStats = null
fileCount = null
autoRefresh = null
refresh = null

# 初始化DOM元素
initDOMElements = ->
    imageInput = $ '#image'
    uploadArea = $ '#upload-area'
    imageList = $ '#image-list'
    previewContainer = $ '#preview-container'
    fileStats = $ '#file-stats'
    fileCount = $ '#file-count'
    autoRefresh = $ '#auto-refresh'
    refresh = $ '#refresh'

# 工具函数
dataURItoBlob = (dataURI) ->
    binStr = atob (dataURI.split ',')[1]
    len = binStr.length
    arr = new Uint8Array len
    for i in [0..len - 1]
        arr[i] = binStr.charCodeAt i
    new Blob [arr], type: 'image/png'

generateFileName = (originalName) ->
    pad = (n) -> if n < 10 then '0' + n else n
    d = new Date
    timestamp = '' + d.getFullYear() + '-' + (pad d.getMonth() + 1) + '-' + (pad d.getDate()) + ' ' + \
        (pad d.getHours()) + (pad d.getMinutes()) + (pad d.getSeconds())
    
    if originalName
        name = originalName.replace(/\.[^/.]+$/, "")
        "#{name}_watermark_#{timestamp}.png"
    else
        "watermark_#{timestamp}.png"

formatFileSize = (bytes) ->
    if bytes < 1024
        bytes + ' B'
    else if bytes < 1024 * 1024
        (bytes / 1024).toFixed(1) + ' KB'
    else
        (bytes / (1024 * 1024)).toFixed(1) + ' MB'

# 样式生成
makeStyle = ->
    match = input.color.value.match /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    'rgba(' + (parseInt match[1], 16) + ',' + (parseInt match[2], 16) + ',' \
         + (parseInt match[3], 16) + ',' + input.alpha.value + ')'

# 绘制水印
drawWatermark = (canvas, img) ->
    return unless canvas and img
    
    ctx = canvas.getContext '2d'
    canvas.width = img.width
    canvas.height = img.height
    
    # 清除并绘制原图
    ctx.clearRect 0, 0, canvas.width, canvas.height
    ctx.drawImage img, 0, 0
    
    # 如果没有输入文字，直接返回（只显示原图）
    return unless input.text.value.trim()
    
    # 计算文字大小
    textSize = input.size.value * Math.max 15, (Math.min canvas.width, canvas.height) / 25
    
    # 设置文字样式
    ctx.save()
    ctx.translate canvas.width / 2, canvas.height / 2
    ctx.rotate (input.angle.value) * Math.PI / 180
    ctx.fillStyle = makeStyle()
    ctx.font = 'bold ' + textSize + 'px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif'
    
    # 计算水印布局
    width = (ctx.measureText input.text.value).width
    step = Math.sqrt (Math.pow canvas.width, 2) + (Math.pow canvas.height, 2)
    margin = (ctx.measureText '啊').width
    
    x = Math.ceil step / (width + margin)
    y = Math.ceil (step / (input.space.value * textSize)) / 2
    
    # 绘制水印
    for i in [-x..x]
        for j in [-y..y]
            ctx.fillText input.text.value, (width + margin) * i, input.space.value * textSize * j
    
    ctx.restore()

# 创建图片项目
createImageItem = (file, index) ->
    item = document.createElement 'div'
    item.className = 'image-item'
    item.dataset.index = index
    
    # 创建缩略图
    img = document.createElement 'img'
    img.className = 'image-thumbnail'
    img.src = URL.createObjectURL file
    
    # 创建信息区域
    info = document.createElement 'div'
    info.className = 'image-info'
    
    name = document.createElement 'div'
    name.className = 'image-name'
    name.textContent = file.name
    name.title = file.name
    
    size = document.createElement 'div'
    size.className = 'image-size'
    size.textContent = formatFileSize file.size
    
    info.appendChild name
    info.appendChild size
    
    # 创建删除按钮
    deleteBtn = document.createElement 'button'
    deleteBtn.className = 'btn-delete'
    deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3,6 5,6 21,6"></polyline><path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path></svg>'
    deleteBtn.title = '删除图片'
    deleteBtn.addEventListener 'click', (e) ->
        e.stopPropagation()
        removeImage index
    
    # 创建复选框
    checkbox = document.createElement 'input'
    checkbox.type = 'checkbox'
    checkbox.className = 'image-checkbox'
    checkbox.checked = true
    
    item.appendChild img
    item.appendChild info
    item.appendChild deleteBtn
    item.appendChild checkbox
    
    # 点击事件
    item.addEventListener 'click', (e) ->
        unless e.target.type is 'checkbox' or e.target.closest('.btn-delete')
            selectImage index
    
    item

# 删除单个图片
removeImage = (index) ->
    return if index < 0 or index >= files.length
    
    # 删除文件和对应的canvas
    files.splice index, 1
    delete canvases[index]
    
    # 重新构建canvases对象，调整索引
    newCanvases = {}
    for key of canvases
        oldIndex = parseInt key
        if oldIndex > index
            newCanvases[oldIndex - 1] = canvases[key]
        else if oldIndex < index
            newCanvases[oldIndex] = canvases[key]
    canvases = newCanvases
    
    # 调整当前选中的图片索引
    if currentImageIndex is index
        # 如果删除的是当前选中的图片
        if files.length is 0
            currentImageIndex = -1
        else if currentImageIndex >= files.length
            currentImageIndex = files.length - 1
    else if currentImageIndex > index
        currentImageIndex--
    
    # 更新显示
    updateImageList()
    
    # 如果还有图片且有选中的图片，显示预览
    if files.length > 0 and currentImageIndex >= 0
        selectImage currentImageIndex

# 选择图片
selectImage = (index) ->
    # 移除之前的激活状态
    activeItems = $$ '.image-item.active'
    activeItems.forEach (item) -> item.classList.remove 'active'
    # 设置新的激活状态
    newItem = $ ".image-item[data-index='#{index}']"
    newItem?.classList.add 'active'
    
    currentImageIndex = index
    showPreview index

# 显示预览
showPreview = (index) ->
    return unless files[index]
    
    file = files[index]
    
    # 如果已有canvas，直接显示
    if canvases[index]
        displayCanvas canvases[index]
        return
    
    # 创建新的canvas
    img = new Image
    img.onload = ->
        canvas = document.createElement 'canvas'
        canvases[index] = canvas
        drawWatermark canvas, img
        displayCanvas canvas
    
    img.src = URL.createObjectURL file

# 显示canvas
displayCanvas = (canvas) ->
    previewContainer.innerHTML = ''
    canvas.className = 'preview-canvas'
    
    # 添加点击下载功能
    canvas.addEventListener 'click', ->
        downloadCanvas canvas, files[currentImageIndex]?.name
    
    previewContainer.appendChild canvas

# 下载canvas
downloadCanvas = (canvas, filename) ->
    link = document.createElement 'a'
    link.download = generateFileName filename
    imageData = canvas.toDataURL 'image/png'
    blob = dataURItoBlob imageData
    link.href = URL.createObjectURL blob
    
    document.body.appendChild link
    link.click()
    document.body.removeChild link

# 更新图片列表显示
updateImageList = ->
    if files.length is 0
        imageList.innerHTML = '''
            <div class="empty-list">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                </svg>
                <p>暂无图片</p>
            </div>
        '''
        previewContainer.innerHTML = '''
            <div class="preview-empty">
                <svg class="preview-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                </svg>
                <p>请选择图片查看预览</p>
            </div>
        '''
        fileStats.style.display = 'none'
        currentImageIndex = -1
        return
    
    # 显示文件统计
    fileCount.textContent = files.length
    fileStats.style.display = 'flex'
    
    # 创建图片列表
    imageList.innerHTML = ''
    files.forEach (file, index) ->
        item = createImageItem file, index
        imageList.appendChild item
    
    # 如果没有选中的图片，选中第一个
    if currentImageIndex < 0 or currentImageIndex >= files.length
        selectImage 0

# 刷新所有预览
refreshAllPreviews = ->
    return unless files.length > 0
    
    canvases = {}  # 清空缓存
    
    if currentImageIndex >= 0
        showPreview currentImageIndex

# 更新范围输入显示值
updateRangeValues = ->
    # 透明度
    if input.alpha
        alphaValue = input.alpha.parentNode.querySelector '.range-value'
        alphaValue.textContent = input.alpha.value if alphaValue
    
    # 角度
    if input.angle
        angleValue = input.angle.parentNode.querySelector '.range-value'
        angleValue.textContent = input.angle.value + '°' if angleValue
    
    # 间隔
    if input.space
        spaceValue = input.space.parentNode.querySelector '.range-value'
        spaceValue.textContent = input.space.value if spaceValue
    
    # 字号
    if input.size
        sizeValue = input.size.parentNode.querySelector '.range-value'
        sizeValue.textContent = input.size.value if sizeValue

# 更新颜色显示值
updateColorValue = ->
    if input.color
        colorValue = input.color.parentNode.querySelector '.color-value'
        colorValue.textContent = input.color.value if colorValue

# 文件上传处理
handleFiles = (fileList) ->
    newFiles = Array.from(fileList).filter (file) ->
        file.type in ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    
    if newFiles.length is 0
        alert '请选择有效的图片文件（PNG、JPG、GIF、WebP）'
        return
    
    files = files.concat newFiles
    updateImageList()

# 事件监听器设置
setupEventListeners = ->
    # 文件输入
    imageInput.addEventListener 'change', (e) ->
        handleFiles e.target.files if e.target.files.length > 0
    
    # 拖拽上传
    uploadArea.addEventListener 'dragover', (e) ->
        e.preventDefault()
        uploadArea.classList.add 'drag-over'
    
    uploadArea.addEventListener 'dragleave', (e) ->
        e.preventDefault()
        uploadArea.classList.remove 'drag-over'
    
    uploadArea.addEventListener 'drop', (e) ->
        e.preventDefault()
        uploadArea.classList.remove 'drag-over'
        handleFiles e.dataTransfer.files if e.dataTransfer.files.length > 0
    
    # 清空文件
    clearBtn = $ '#clear-files'
    clearBtn?.addEventListener 'click', ->
        files = []
        canvases = {}
        currentImageIndex = -1
        updateImageList()
        imageInput.value = ''
    
    # 全选/取消全选
    selectAllBtn = $ '#select-all'
    selectAllBtn?.addEventListener 'click', ->
        checkboxes = $$ '.image-checkbox'
        checkboxes.forEach (cb) -> cb.checked = true
    
    deselectAllBtn = $ '#deselect-all'
    deselectAllBtn?.addEventListener 'click', ->
        checkboxes = $$ '.image-checkbox'
        checkboxes.forEach (cb) -> cb.checked = false
    
    # 下载当前
    downloadCurrentBtn = $ '#download-current'
    downloadCurrentBtn?.addEventListener 'click', ->
        if currentImageIndex >= 0 and canvases[currentImageIndex]
            downloadCanvas canvases[currentImageIndex], files[currentImageIndex]?.name
        else
            alert '请先选择要下载的图片'
    
    # 下载选中
    downloadSelectedBtn = $ '#download-selected'
    downloadSelectedBtn?.addEventListener 'click', ->
        selectedItems = Array.from($$ '.image-checkbox:checked').map (cb) ->
            parseInt cb.parentNode.dataset.index
        
        if selectedItems.length is 0
            alert '请先选择要下载的图片'
            return
        
        downloadSelected selectedItems
    
    # 批量导出
    downloadAllBtn = $ '#download-all'
    downloadAllBtn?.addEventListener 'click', ->
        if files.length is 0
            alert '请先上传图片'
            return
        
        downloadAll()
    
    # 刷新预览
    refresh.addEventListener 'click', refreshAllPreviews
    
    # 自动刷新切换
    autoRefresh.addEventListener 'change', ->
        if @checked
            refresh.setAttribute 'disabled', 'disabled'
        else
            refresh.removeAttribute 'disabled'

# 批量下载选中项
downloadSelected = (indices) ->
    return unless indices.length > 0
    
    # 检查JSZip是否可用
    unless window.JSZip
        alert '错误：JSZip库未加载，无法创建ZIP文件'
        return
    
    showProgressModal()
    zip = new JSZip()
    processedCount = 0
    
    processNext = ->
        if processedCount >= indices.length
            # 生成ZIP文件
            updateProgress indices.length, indices.length, "正在生成ZIP文件..."
            
            zip.generateAsync({type: "blob"}).then (content) ->
                # 创建下载链接
                now = new Date()
                timestamp = "#{now.getFullYear()}-#{String(now.getMonth() + 1).padStart(2, '0')}-#{String(now.getDate()).padStart(2, '0')}_#{String(now.getHours()).padStart(2, '0')}#{String(now.getMinutes()).padStart(2, '0')}#{String(now.getSeconds()).padStart(2, '0')}"
                filename = "watermark_images_#{timestamp}.zip"
                
                link = document.createElement 'a'
                link.href = URL.createObjectURL content
                link.download = filename
                document.body.appendChild link
                link.click()
                document.body.removeChild link
                
                hideProgressModal()
            .catch (error) ->
                console.error '生成ZIP文件失败:', error
                alert '生成ZIP文件失败，请重试'
                hideProgressModal()
            return
        
        index = indices[processedCount]
        file = files[index]
        
        updateProgress processedCount + 1, indices.length, "正在处理: #{file.name}"
        
        # 确保canvas存在
        unless canvases[index]
            img = new Image
            img.onload = ->
                canvas = document.createElement 'canvas'
                canvases[index] = canvas
                drawWatermark canvas, img
                
                # 将canvas转换为blob并添加到ZIP
                canvas.toBlob (blob) ->
                    if blob
                        zip.file file.name, blob
                    processedCount++
                    setTimeout processNext, 100
                , 'image/png'
            img.src = URL.createObjectURL file
        else
            # 将canvas转换为blob并添加到ZIP
            canvases[index].toBlob (blob) ->
                if blob
                    zip.file file.name, blob
                processedCount++
                setTimeout processNext, 100
            , 'image/png'
    
    processNext()

# 批量下载全部
downloadAll = ->
    indices = [0...files.length]
    downloadSelected indices

# 显示进度模态框
showProgressModal = ->
    modal = $ '#progress-modal'
    modal.style.display = 'flex' if modal

# 隐藏进度模态框
hideProgressModal = ->
    modal = $ '#progress-modal'
    modal.style.display = 'none' if modal

# 更新进度
updateProgress = (current, total, text) ->
    progressFill = $ '#progress-fill'
    progressText = $ '#progress-text'
    
    if progressFill
        percentage = (current / total) * 100
        progressFill.style.width = percentage + '%'
    
    if progressText
        progressText.textContent = text

# 初始化
init = ->
    # 初始化DOM元素
    initDOMElements()
    
    # 初始化输入控件
    inputItems.forEach (item) ->
        el = document.getElementById item
        input[item] = el if el?
        if el? and typeof el.addEventListener is 'function'
            el.addEventListener 'input', ->
                updateRangeValues()
                updateColorValue()
                refreshAllPreviews() if autoRefresh?.checked
    
    # 设置事件监听器
    setupEventListeners()
    
    # 初始化显示值
    updateRangeValues()
    updateColorValue()
    
    # 初始化图片列表
    updateImageList()

# 页面加载完成后初始化
document.addEventListener 'DOMContentLoaded', init

