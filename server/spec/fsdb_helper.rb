module Jashboard
  class FSDBHelper
    def initialize(db_path)
      @db_path = db_path
    end

    def clean_data
      FileUtils.rm Dir.glob("#{@db_path}/**/*.txt")
      FileUtils.rm Dir.glob("#{@db_path}/**/..fsdb.meta.*.txt")
    end

    def method_missing(method, args)
      match = method.to_s.match(/(serialize|verify|load)_(monitor|dashboard)/)
      super(method, args) if match.nil?
      if(match[1] == 'load')
        puts "#{match[2]}/#{args}.txt"
        self.send("#{match[1]}_yaml".to_sym, "#{match[2]}/#{args}.txt")  
      else
        self.send("#{match[1]}_yaml".to_sym, "#{match[2]}/#{args.id}.txt", args)
      end
    end

    private

    def load_yaml(file_path)
      YAML.load_file("#{@db_path}/#{file_path}")
    end

    def serialize_yaml(file_path, obj)
      File.open("#{@db_path}/#{file_path}", "w") do |f|
        f.write(YAML.dump(obj))
      end
    end

    def verify_yaml(file_path, obj)
      File.open("#{@db_path}/#{file_path}") do |f|
        f.read.should == obj.to_yaml
      end
    end
  end
end